const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const pool = require("../../database/postgres/pool");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("ReplyRepositoryPostgres", () => {
  beforeEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addReply function", () => {
    it("should persist the reply data", async () => {
      const fakeIdGenerator = () => "10digit-id";
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const content = "Ini adalah balasan";
      const commentId = "comment-10digit-id";
      const owner = "user-10digit-id";
      await CommentsTableTestHelper.addCommentAndParent({
        id: commentId,
        owner,
      });
      await replyRepositoryPostgres.addReply({
        content,
        owner,
        commentId,
      });

      const replies = await RepliesTableTestHelper.findRepliesById(
        `reply-${fakeIdGenerator()}`
      );

      expect(replies).toHaveLength(1);
    });
    it("should return addedReply correctly", async () => {
      const fakeIdGenerator = () => "10digit-id";
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const content = "Ini adalah balasan";
      const commentId = "comment-10digit-id";
      const owner = "user-10digit-id";
      await CommentsTableTestHelper.addCommentAndParent({
        id: commentId,
        owner,
      });
      const addedReply = await replyRepositoryPostgres.addReply({
        content,
        owner,
        commentId,
      });

      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: "reply-10digit-id",
          content,
          owner,
        })
      );
    });
  });

  describe("verifyIsReplyExists function", () => {
    it("should throw NotFoundError when id is not stored in database", async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        () => {}
      );

      expect(
        replyRepositoryPostgres.verifyIsReplyExists("fake-10-digitId")
      ).rejects.toThrowError(new NotFoundError("balasan tidak ditemukan"));
    });
    it("should not throw Error when id is stored in database", async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        () => {}
      );
      await RepliesTableTestHelper.addReplyAndParent({
        id: "reply-10-digitId",
      });
      await RepliesTableTestHelper.findRepliesById("reply-10-digitId");
      expect(
        replyRepositoryPostgres.verifyIsReplyExists("reply-10-digitId")
      ).resolves.not.toThrowError();
    });
  });

  describe("verifyReplyOwner function", () => {
    it("should throw error when not given 2 parameter", () => {
      const fakeIdGenerator = () => {};
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      expect(
        replyRepositoryPostgres.verifyReplyOwner("reply-10-digitId")
      ).rejects.toThrowError("VERIFY_REPLY.NOT_CONTAIN_NEEDED_PARAMETER");
    });

    it("should throw AuthorizationError when given comment not owned by given user id", async () => {
      const fakeIdGenerator = () => {};
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const replyId = "reply-10-digitId";
      const owner = "user-10-digitId";

      await RepliesTableTestHelper.addReplyAndParent({
        id: replyId,
        owner,
      });

      expect(
        replyRepositoryPostgres.verifyReplyOwner(replyId, "this-fake-id")
      ).rejects.toThrowError(
        new AuthorizationError("anda tidak berhak mengakses resource ini")
      );
    });

    it("should not throw Error when given comment owned by given user id", async () => {
      const fakeIdGenerator = () => {};
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const id = "reply-10-digitId";
      const owner = "user-10-digitId";
      await RepliesTableTestHelper.addReplyAndParent({
        id,
        owner,
      });
      // const test = await RepliesTableTestHelper.findRepliesById(id);
      replyRepositoryPostgres.verifyIsReplyExists(id);
      await expect(
        replyRepositoryPostgres.verifyReplyOwner(id, owner)
      ).resolves.not.toThrowError();
    });
  });
  describe("deleteReply function", () => {
    it("should set is_deleted property from reply in database", async () => {
      const fakeIdGenerator = () => {};
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const replyId = "reply-10-digitId";
      const owner = "user-10-digitId";
      await RepliesTableTestHelper.addReplyAndParent({
        id: replyId,
        owner,
      });

      const comments = await RepliesTableTestHelper.findRepliesById(replyId);
      expect(comments[0].is_deleted).toEqual(false);

      await replyRepositoryPostgres.deleteReply(replyId);

      const deletedComment = await await RepliesTableTestHelper.findRepliesById(
        replyId
      );

      expect(deletedComment[0].is_deleted).toEqual(true);
    });
  });
  describe("getRepliesByCommentId function", () => {
    it("should return correct list of replies", async () => {
      const fakeIdGenerator = () => {};
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const id = "reply-randomId";
      const owner = "user-10-digitId";
      const commentId = "comment-10-digitId";
      const username = "dicoding";
      await RepliesTableTestHelper.addReplyAndParent({
        id: `${id}1`,
        owner,
        content: "balasan pertama",
        commentId,
        username,
      });
      await RepliesTableTestHelper.addReply({
        id: `${id}2`,
        content: "balasan kedua",
        commentId,
        owner,
      });

      await RepliesTableTestHelper.deleteReplyById(`${id}2`);

      const { replies } = await replyRepositoryPostgres.getRepliesByCommentId(
        commentId
      );

      expect(replies[0].id).toEqual(`${id}1`);
      expect(replies[0].username).toEqual(username);
      expect(replies[0].content).toEqual("balasan pertama");
      expect(replies[0].date).toBeInstanceOf(Date);
      expect(replies[0].date).toBeDefined();

      expect(replies[1].id).toEqual(`${id}2`);
      expect(replies[1].username).toEqual(username);
      expect(replies[1].content).toEqual("**balasan telah dihapus**");
      expect(replies[1].date).toBeInstanceOf(Date);
      expect(replies[1].date).toBeDefined();
    });
  });
});

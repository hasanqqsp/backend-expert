const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const CommentItem = require("../../../Domains/comments/entities/CommentItem");

describe("CommentRepositoryPostgres", () => {
  beforeEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist addedComment", async () => {
      const fakeIdGenerator = () => "10-digitId";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await ThreadsTableTestHelper.addThreadAndParent({});
      const content = "Ini adalah komentar";

      await commentRepositoryPostgres.addComment({
        content,
        owner: "user-10-digitId",
        threadId: "thread-10-digitId",
      });

      const comments = await CommentsTableTestHelper.findCommentsById(
        "comment-10-digitId"
      );

      expect(comments).toHaveLength(1);
    });

    it("should return addedComment correctly", async () => {
      const fakeIdGenerator = () => "10-digitId";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await ThreadsTableTestHelper.addThreadAndParent({});
      const content = "Ini adalah komentar";
      const addedComment = await commentRepositoryPostgres.addComment({
        content,
        owner: "user-10-digitId",
        threadId: "thread-10-digitId",
      });

      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-10-digitId",
          content,
          owner: "user-10-digitId",
        })
      );
    });
  });

  describe("verifyIsCommentExists function", () => {
    it("should throw NotFoundError when given id not stored in database", () => {
      const fakeIdGenerator = () => {};
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      expect(
        commentRepositoryPostgres.verifyIsCommentExists("this-fake-id")
      ).rejects.toThrowError("komentar tidak ditemukan");
    });
    it("should not throw NotFoundError when given id stored in database", async () => {
      const fakeIdGenerator = () => {};
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const owner = "user-10-digitId";
      const commentId = "comment-10-digitId";

      await CommentsTableTestHelper.addCommentAndParent({
        id: commentId,
        owner,
      });
      await CommentsTableTestHelper.findCommentsById(commentId);
      // entah kenapa pengujian gagal jika tidak ditambahkan baris ini, mungkin bisa dijelaskan
      expect(
        commentRepositoryPostgres.verifyIsCommentExists(commentId)
      ).resolves.not.toThrowError();
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should throw error when not given 2 parameter", () => {
      const fakeIdGenerator = () => {};
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      expect(
        commentRepositoryPostgres.verifyCommentOwner("comment-10-digitId")
      ).rejects.toThrowError("VERIFY_COMMENT.NOT_CONTAIN_NEEDED_PARAMETER");
    });

    it("should throw AuthorizationError when given comment not owned by given user id", async () => {
      const fakeIdGenerator = () => {};
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await CommentsTableTestHelper.addCommentAndParent({});
      expect(
        commentRepositoryPostgres.verifyCommentOwner(
          "comment-10-digitId",
          "this-fake-user-id"
        )
      ).rejects.toThrowError("anda tidak berhak mengakses resource ini");
    });
    it("should not throw Error when given comment owned by given user id", async () => {
      const fakeIdGenerator = () => {};
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await CommentsTableTestHelper.addCommentAndParent({});
      await CommentsTableTestHelper.findCommentsById("comment-10-digitId");
      expect(
        commentRepositoryPostgres.verifyCommentOwner(
          "comment-10-digitId",
          "user-10-digitId"
        )
      ).resolves.not.toThrowError();
    });
  });

  describe("deleteComment function", () => {
    it("should set isDeleted properties from comment in database", async () => {
      const fakeIdGenerator = () => "10-digitId";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await CommentsTableTestHelper.addCommentAndParent({});

      const comments = await CommentsTableTestHelper.findCommentsById(
        "comment-10-digitId"
      );
      expect(comments[0].is_deleted).toEqual(false);

      await commentRepositoryPostgres.deleteComment("comment-10-digitId");

      const deletedComment = await CommentsTableTestHelper.findCommentsById(
        "comment-10-digitId"
      );

      expect(deletedComment[0].is_deleted).toEqual(true);
    });
  });

  describe("getCommentsById function", () => {
    it("should return correct comments data from thread", async () => {
      const fakeIdGenerator = () => "10-digitId";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const commentId = "comment-10digitId";
      const username = "dicoding";
      const content = "Ini adalah Komentar";

      await CommentsTableTestHelper.addCommentAndParent({
        id: `${commentId}1`,
      });
      await CommentsTableTestHelper.addComment({
        id: `${commentId}2`,
      });

      const { comments } =
        await commentRepositoryPostgres.getCommentsByThreadId(
          "thread-10-digitId"
        );
      expect(comments).toHaveLength(2);

      expect(comments[0].id).toEqual(`${commentId}1`);
      expect(comments[0].username).toEqual(username);
      expect(comments[0].content).toEqual(content);
      expect(comments[0].created_at).toBeInstanceOf(Date);
      expect(comments[0].created_at).toBeDefined();

      expect(comments[1].id).toEqual(`${commentId}2`);
      expect(comments[1].username).toEqual(username);
      expect(comments[1].content).toEqual(content);
      expect(comments[1].created_at).toBeInstanceOf(Date);
      expect(comments[1].created_at).toBeDefined();
    });
  });
});

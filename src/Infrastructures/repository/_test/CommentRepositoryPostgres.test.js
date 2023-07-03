const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const CommentItem = require("../../../Domains/comments/entities/CommentItem");

describe("CommentRepositoryPostgres", () => {
  // beforeEach(async () => {
  //   await ThreadsTableTestHelper.cleanTable();
  //   await UsersTableTestHelper.cleanTable();
  //   await CommentsTableTestHelper.cleanTable();
  // });
  beforeEach(async () => {
    await ThreadsTableTestHelper.addThreadAndParent({});
  });
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist addedComment", async () => {
      const fakeIdGenerator = () => "10-digitId";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

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

      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner,
      });
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

      await CommentsTableTestHelper.addComment({});
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

      await CommentsTableTestHelper.addComment({});
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

      await CommentsTableTestHelper.addComment({});

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

      const expected = [
        new CommentItem({
          id: `${commentId}1`,
          username: "dicoding",
          content: "Ini adalah Komentar 1",
          created_at: new Date("2021-08-08T07:22:33.555Z"),
          is_deleted: false,
        }),
        new CommentItem({
          id: `${commentId}2`,
          username: "dicoding",
          content: "Ini adalah Komentar 2",
          created_at: new Date("2021-09-08T07:22:33.555Z"),
          is_deleted: false,
        }),
      ];

      await CommentsTableTestHelper.addComment({
        id: `${commentId}1`,
        date: new Date("2021-08-08T07:22:33.555Z"),
        content: "Ini adalah Komentar 1",
      });
      await CommentsTableTestHelper.addComment({
        id: `${commentId}2`,
        date: new Date("2021-09-08T07:22:33.555Z"),
        content: "Ini adalah Komentar 2",
      });

      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        "thread-10-digitId"
      );

      expect(comments).toStrictEqual(expected);
    });
  });
});

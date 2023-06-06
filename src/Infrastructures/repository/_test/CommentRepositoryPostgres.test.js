const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");

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
      const fakeIdGenerator = () => "10digit-id";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await UsersTableTestHelper.addUser({ id: "user-10digit-id" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-10digit-id",
        owner: "user-10digit-id",
      });
      const content = "Ini adalah komentar";

      await commentRepositoryPostgres.addComment({
        content,
        owner: "user-10digit-id",
        threadId: "thread-10digit-id",
      });

      const comments = await CommentsTableTestHelper.findCommentsById(
        "comment-10digit-id"
      );

      expect(comments).toHaveLength(1);
    });
    it("should return addedComment correctly", async () => {
      const fakeIdGenerator = () => "10digit-id";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await UsersTableTestHelper.addUser({
        id: "user-10digit-id",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-10digit-id",
        owner: "user-10digit-id",
      });
      const content = "Ini adalah komentar";
      const addedComment = await commentRepositoryPostgres.addComment({
        content,
        owner: "user-10digit-id",
        threadId: "thread-10digit-id",
      });

      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-10digit-id",
          content,
          owner: "user-10digit-id",
        })
      );
    });
  });

  describe("findCommentId function", () => {
    it("should throw NotFoundError when given id not stored in database", () => {
      const fakeIdGenerator = () => {};
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      expect(
        commentRepositoryPostgres.findCommentId("this-fake-id")
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
        commentRepositoryPostgres.findCommentId(commentId)
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
      const userId = "user-10-digitId";
      const threadId = "thread-10-digitId";
      const commentId = "thread-10-commentId";
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: userId,
      });
      expect(
        commentRepositoryPostgres.verifyCommentOwner(
          commentId,
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
      const userId = "user-10-digitId";
      const threadId = "thread-10-digitId";
      const commentId = "comment-10-digitId";
      const userOwnerComment = "user-commented";
      await UsersTableTestHelper.addUser({ id: userId });
      await UsersTableTestHelper.addUser({
        id: userOwnerComment,
        username: "comment_user",
      });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: userOwnerComment,
      });
      await CommentsTableTestHelper.findCommentsById(commentId);
      expect(
        commentRepositoryPostgres.verifyCommentOwner(
          commentId,
          userOwnerComment
        )
      ).resolves.not.toThrowError();
    });
  });

  describe("deleteComment function", () => {
    it("should set isDeleted properties from comment in database", async () => {
      const fakeIdGenerator = () => "10digit-id";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const userId = "user-10-digitId";
      const threadId = "thread-10-digitId";
      const commentId = "thread-10-commentId";
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: userId,
      });

      const comments = await CommentsTableTestHelper.findCommentsById(
        commentId
      );
      expect(comments[0].is_deleted).toEqual(false);

      await commentRepositoryPostgres.deleteComment(commentId);

      const deletedComment = await CommentsTableTestHelper.findCommentsById(
        commentId
      );

      expect(deletedComment[0].is_deleted).toEqual(true);
    });
  });

  describe("getCommentsById function", () => {
    it("should return correct comments data from thread", async () => {
      const fakeIdGenerator = () => "10digit-id";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const userId = "user-10-digitId";
      const threadId = "thread-10-digitId";
      const commentId = "thread-10commentId";
      const username = "dicoding";
      const content = "Ini adalah komentar";
      await UsersTableTestHelper.addUser({ id: userId, username });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({
        id: `${commentId}1`,
        threadId,
        content,
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({
        id: `${commentId}2`,
        threadId,
        content,
        owner: userId,
      });

      await CommentsTableTestHelper.deleteCommentById(`${commentId}2`);

      const { comments } =
        await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      expect(comments[0].id).toEqual(`${commentId}1`);
      expect(comments[0].username).toEqual(username);
      expect(comments[0].content).toEqual(content);
      expect(typeof comments[0].date).toEqual("string");
      expect(comments[0].date).toBeDefined();

      expect(comments[1].id).toEqual(`${commentId}2`);
      expect(comments[1].username).toEqual(username);
      expect(comments[1].content).toEqual("**komentar telah dihapus**");
      expect(typeof comments[1].date).toEqual("string");
      expect(comments[1].date).toBeDefined();
    });
  });
});

const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const LikesCommentTableTestHelper = require("../../../../tests/LikesCommentTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const LikesCommentRepositoryPostgres = require("../LikesCommentRepositoryPostgres");
const pool = require("../../database/postgres/pool");

describe("CommentRepositoryPostgres", () => {
  beforeEach(async () => {
    await CommentsTableTestHelper.addCommentAndParent({});
  });
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesCommentTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe("verifyIsCommentLiked function", () => {
    it("should return true if comment is liked", async () => {
      await LikesCommentTableTestHelper.addLike({});
      const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(
        pool
      );
      const isLiked = await likesCommentRepositoryPostgres.verifyIsCommentLiked(
        "comment-10-digitId",
        "user-10-digitId"
      );
      expect(isLiked).toEqual(true);
    });
    it("should return true if comment is not liked", async () => {
      const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(
        pool
      );
      const isLiked = await likesCommentRepositoryPostgres.verifyIsCommentLiked(
        "comment-10-digitId",
        "user-10-digitId"
      );
      expect(isLiked).toEqual(false);
    });
  });

  describe("addLike function", () => {
    it("should persist like data", async () => {
      const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(
        pool
      );
      await likesCommentRepositoryPostgres.addLike(
        "comment-10-digitId",
        "user-10-digitId"
      );
      const isLiked = await likesCommentRepositoryPostgres.verifyIsCommentLiked(
        "comment-10-digitId",
        "user-10-digitId"
      );
      expect(isLiked).toEqual(true);
    });
  });
  describe("deleteLike function", () => {
    it("should delete like data", async () => {
      const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(
        pool
      );
      await LikesCommentTableTestHelper.addLike({});

      await likesCommentRepositoryPostgres.deleteLike(
        "comment-10-digitId",
        "user-10-digitId"
      );
      const isLiked = await likesCommentRepositoryPostgres.verifyIsCommentLiked(
        "comment-10-digitId",
        "user-10-digitId"
      );
      expect(isLiked).toEqual(false);
    });
  });
  describe("getLikeCountByCommentsId function", () => {
    it("should return like count data by commentsId", async () => {
      const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(
        pool
      );

      await LikesCommentTableTestHelper.addLike({});

      const commentsLikeCount =
        await likesCommentRepositoryPostgres.getLikeCountByCommentsId([
          "comment-fake-comm",
          "comment-10-digitId",
        ]);
      expect(commentsLikeCount).toStrictEqual([
        { count: "1", commentId: "comment-10-digitId" },
      ]);
    });
  });
});

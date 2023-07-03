const LikesCommentRepository = require("../LikesCommentRepository");

describe("LikesCommentRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const likesCommentRepository = new LikesCommentRepository();

    // Action and Assert
    await expect(likesCommentRepository.addLike({})).rejects.toThrowError(
      "LIKES_COMMENT.METHOD_NOT_IMPLEMENTED"
    );
    await expect(likesCommentRepository.deleteLike({})).rejects.toThrowError(
      "LIKES_COMMENT.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      likesCommentRepository.verifyIsCommentLiked({})
    ).rejects.toThrowError("LIKES_COMMENT.METHOD_NOT_IMPLEMENTED");
    await expect(
      likesCommentRepository.getLikeCountByCommentsId({})
    ).rejects.toThrowError("LIKES_COMMENT.METHOD_NOT_IMPLEMENTED");
  });
});

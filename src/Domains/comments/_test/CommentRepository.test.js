const CommentRepository = require("../CommentRepository");

describe("CommentRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action and Assert
    await expect(commentRepository.addComment({})).rejects.toThrowError(
      "COMMENT.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      commentRepository.verifyIsCommentExists()
    ).rejects.toThrowError("COMMENT.METHOD_NOT_IMPLEMENTED");
    await expect(commentRepository.verifyCommentOwner()).rejects.toThrowError(
      "COMMENT.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.deleteComment()).rejects.toThrowError(
      "COMMENT.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      commentRepository.getCommentsByThreadId()
    ).rejects.toThrowError("ADD_COMMENT.METHOD_NOT_IMPLEMENTED");
  });
});

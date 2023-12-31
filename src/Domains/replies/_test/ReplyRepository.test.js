const ReplyRepository = require("../ReplyRepository");

describe("ReplyRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action and Assert
    await expect(replyRepository.addReply({})).rejects.toThrowError(
      "REPLY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(replyRepository.verifyIsReplyExists()).rejects.toThrowError(
      "REPLY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(replyRepository.verifyReplyOwner()).rejects.toThrowError(
      "REPLY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(replyRepository.deleteReply()).rejects.toThrowError(
      "REPLY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(replyRepository.getRepliesByCommentsId()).rejects.toThrowError(
      "REPLY.METHOD_NOT_IMPLEMENTED"
    );
  });
});

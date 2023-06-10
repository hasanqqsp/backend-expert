const ThreadRepository = require("../ThreadRepository");

describe("ThreadRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action and Assert
    await expect(threadRepository.addThread({})).rejects.toThrowError(
      "ADD_THREAD.METHOD_NOT_IMPLEMENTED"
    );
    await expect(threadRepository.verifyIsThreadExists()).rejects.toThrowError(
      "ADD_THREAD.METHOD_NOT_IMPLEMENTED"
    );
    await expect(threadRepository.getByThreadId()).rejects.toThrowError(
      "ADD_THREAD.METHOD_NOT_IMPLEMENTED"
    );
  });
});

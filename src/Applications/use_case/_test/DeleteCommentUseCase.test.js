const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("DeleteCommentUseCase", () => {
  it("should orchestrate delete comment action correctly", async () => {
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyIsThreadExists = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.verifyIsCommentExists = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const threadId = "thread-10-digitid";
    const commentId = "comment-10-digitid";
    const credentialId = "credentials";
    await deleteCommentUseCase.execute({
      threadId,
      commentId,
      credentialId,
    });
    expect(mockThreadRepository.verifyIsThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyIsCommentExists).toBeCalledWith(
      commentId
    );
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      commentId,
      credentialId
    );

    expect(mockCommentRepository.deleteComment).toBeCalledWith(commentId);
  });
});

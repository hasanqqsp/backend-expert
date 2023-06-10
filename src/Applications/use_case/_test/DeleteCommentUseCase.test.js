const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("DeleteCommentUseCase", () => {
  it("should orchestrate delete comment action correctly", async () => {
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyIsThreadExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyIsCommentExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(true));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const threadId = "thread-10-digitid";
    const commentId = "comment-10-digitid";
    const credentialId = "credentials";
    const isDeleted = await deleteCommentUseCase.execute({
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
    expect(isDeleted).toEqual(true);
  });
});

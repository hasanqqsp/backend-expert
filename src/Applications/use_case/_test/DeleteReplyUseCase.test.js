const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");

describe("DeleteReplyUseCase", () => {
  it("should orchestrate delete reply action correctly", async () => {
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyIsThreadExists = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.verifyIsCommentExists = jest.fn(() =>
      Promise.resolve()
    );
    mockReplyRepository.verifyIsReplyExists = jest.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve(true));

    const deleteCommentUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    });
    const threadId = "thread-10-digitid";
    const commentId = "comment-10-digitid";
    const credentialId = "credentials";
    const replyId = "reply-10-digitId";
    const isDeleted = await deleteCommentUseCase.execute({
      threadId,
      commentId,
      credentialId,
      replyId,
    });

    expect(mockThreadRepository.verifyIsThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyIsCommentExists).toBeCalledWith(
      commentId
    );
    expect(mockReplyRepository.verifyIsReplyExists).toBeCalledWith(replyId);

    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(
      replyId,
      credentialId
    );

    expect(mockReplyRepository.deleteReply).toBeCalledWith(replyId);
    expect(isDeleted).toEqual(true);
  });
});

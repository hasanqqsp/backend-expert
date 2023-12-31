const AddReplyUseCase = require("../AddReplyUseCase");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");

describe("AddReplyUseCase", () => {
  it("should orchestrating add reply scenario correctly", async () => {
    const threadId = "thread-10-digitId";
    const commentId = "comment-10-digitId";
    const userId = "user-10-digitId";
    const content = "ini sebuah balasan";
    const replyId = "reply-10-digitId";
    const mockAddedReply = new AddedReply({
      id: replyId,
      content,
      owner: userId,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyIsThreadExists = jest.fn(() =>
      Promise.resolve()
    );

    mockCommentRepository.verifyIsCommentExists = jest.fn(() =>
      Promise.resolve()
    );

    mockReplyRepository.addReply = jest.fn(() =>
      Promise.resolve(mockAddedReply)
    );

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const addedReply = await addReplyUseCase.execute({
      threadId,
      commentId,
      credentialId: userId,
      content,
    });

    expect(addedReply).toStrictEqual(
      new AddedReply({
        id: replyId,
        content,
        owner: userId,
      })
    );

    expect(mockThreadRepository.verifyIsThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyIsCommentExists).toBeCalledWith(
      commentId
    );
    expect(mockReplyRepository.addReply({ commentId, content, owner: userId }));
  });
});

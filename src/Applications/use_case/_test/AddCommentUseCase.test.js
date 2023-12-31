const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddCommentUseCase = require("../AddCommentUseCase");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("AddCommentUseCase", () => {
  it("should orchestrate add Comment action correctly", async () => {
    const content = "Halo ini adalah content";

    const commentId = "comment-10digit-id";
    const userId = "user-this-fake-id";
    const threadId = "thread-10digit-id";

    const mockAddedComment = new AddedComment({
      id: commentId,
      content,
      owner: userId,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    mockCommentRepository.addComment = jest.fn(() =>
      Promise.resolve(mockAddedComment)
    );

    mockThreadRepository.verifyIsThreadExists = jest.fn(() =>
      Promise.resolve()
    );
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });
    const addedComment = await addCommentUseCase.execute({
      content,
      owner: userId,
      threadId,
    });
    expect(mockThreadRepository.verifyIsThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith({
      content,
      owner: userId,
      threadId,
    });
    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: commentId,
        content,
        owner: userId,
      })
    );
  });
});

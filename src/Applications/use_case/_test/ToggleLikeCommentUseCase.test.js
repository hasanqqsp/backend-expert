const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const LikesCommentRepository = require("../../../Domains/likesComment/LikesCommentRepository");
const ToggleLikeCommentUseCase = require("../ToggleLikeCommentUseCase");

describe("ToggleLikeCommentUseCase", () => {
  it("should orchestrate add like action correctly on comment not liked", async () => {
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockLikesCommentRepository = new LikesCommentRepository();

    mockCommentRepository.verifyIsCommentExists = jest.fn(() =>
      Promise.resolve()
    );
    mockThreadRepository.verifyIsThreadExists = jest.fn(() =>
      Promise.resolve()
    );
    mockLikesCommentRepository.verifyIsCommentLiked = jest.fn(() =>
      Promise.resolve(false)
    );
    mockLikesCommentRepository.addLike = jest.fn(() => Promise.resolve());

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likesCommentRepository: mockLikesCommentRepository,
    });

    const credentialId = "user-10-digitId";
    const commentId = "comment-10-digitId";
    const threadId = "comment-10-digitId";

    await toggleLikeCommentUseCase.execute({
      credentialId,
      commentId,
      threadId,
    });

    expect(mockThreadRepository.verifyIsThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyIsCommentExists).toBeCalledWith(
      commentId
    );
    expect(mockLikesCommentRepository.verifyIsCommentLiked).toBeCalledWith(
      commentId,
      credentialId
    );
    expect(mockLikesCommentRepository.addLike).toBeCalledWith(
      commentId,
      credentialId
    );
  });

  it("should orchestrate add like action correctly on comment liked", async () => {
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockLikesCommentRepository = new LikesCommentRepository();

    mockCommentRepository.verifyIsCommentExists = jest.fn(() =>
      Promise.resolve()
    );
    mockThreadRepository.verifyIsThreadExists = jest.fn(() =>
      Promise.resolve()
    );
    mockLikesCommentRepository.verifyIsCommentLiked = jest.fn(() =>
      Promise.resolve(true)
    );
    mockLikesCommentRepository.deleteLike = jest.fn(() => Promise.resolve());

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likesCommentRepository: mockLikesCommentRepository,
    });

    const credentialId = "user-10-digitId";
    const commentId = "comment-10-digitId";
    const threadId = "comment-10-digitId";

    await toggleLikeCommentUseCase.execute({
      credentialId,
      commentId,
      threadId,
    });

    expect(mockThreadRepository.verifyIsThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyIsCommentExists).toBeCalledWith(
      commentId
    );
    expect(mockLikesCommentRepository.verifyIsCommentLiked).toBeCalledWith(
      commentId,
      credentialId
    );
    expect(mockLikesCommentRepository.deleteLike).toBeCalledWith(
      commentId,
      credentialId
    );
  });
});

class ToggleLikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likesCommentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likesCommentRepository = likesCommentRepository;
  }

  async execute({ credentialId, commentId, threadId }) {
    await this._threadRepository.verifyIsThreadExists(threadId);
    await this._commentRepository.verifyIsCommentExists(commentId);
    const isLiked = await this._likesCommentRepository.verifyIsCommentLiked(
      commentId,
      credentialId
    );
    if (!isLiked) {
      await this._likesCommentRepository.addLike(commentId, credentialId);
    } else {
      await this._likesCommentRepository.deleteLike(commentId, credentialId);
    }
  }
}

module.exports = ToggleLikeCommentUseCase;

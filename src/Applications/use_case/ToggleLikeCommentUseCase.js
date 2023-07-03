class ToggleLikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likesCommentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likesCommentRepository = likesCommentRepository;
  }

  async execute({ credentialId, commentId, threadId }) {
    await this._threadRepository.verifyIsThreadExists(threadId);
    await this._commentRepository.verifyIsCommentExists(commentId);
    await this._likesCommentRepository.addLike(commentId, credentialId);
  }
}

module.exports = ToggleLikeCommentUseCase;

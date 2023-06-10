class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute({ threadId, commentId, credentialId }) {
    await this._threadRepository.verifyIsThreadExists(threadId);
    await this._commentRepository.verifyIsCommentExists(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, credentialId);

    const isDeleted = await this._commentRepository.deleteComment(commentId);
    return isDeleted;
  }
}

module.exports = DeleteCommentUseCase;

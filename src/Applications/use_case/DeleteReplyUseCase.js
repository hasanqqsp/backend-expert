class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute({ threadId, commentId, credentialId, replyId }) {
    await this._threadRepository.verifyIsThreadExists(threadId);
    await this._commentRepository.verifyIsCommentExists(commentId);
    await this._replyRepository.verifyIsReplyExists(replyId);
    await this._replyRepository.verifyReplyOwner(replyId, credentialId);
    const isDeleted = await this._replyRepository.deleteReply(replyId);
    return isDeleted;
  }
}
module.exports = DeleteReplyUseCase;

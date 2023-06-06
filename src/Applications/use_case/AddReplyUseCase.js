class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute({
    threadId, commentId, credentialId, content,
  }) {
    await this._threadRepository.findThreadId(threadId);
    await this._commentRepository.findCommentId(commentId);
    if (!content) {
      throw new Error('ADD_REPLY.PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof content !== 'string') {
      throw new Error('ADD_REPLY.PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    const addedReply = await this._replyRepository.addReply({
      commentId,
      content,
      owner: credentialId,
    });
    return addedReply;
  }
}
module.exports = AddReplyUseCase;

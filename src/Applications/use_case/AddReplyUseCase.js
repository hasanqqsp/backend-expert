const NewReply = require("../../Domains/replies/entities/NewReply");

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute({ threadId, commentId, credentialId, content }) {
    await this._threadRepository.verifyIsThreadExists(threadId);
    await this._commentRepository.verifyIsCommentExists(commentId);
    const { content: newContent } = new NewReply({ content });
    const addedReply = await this._replyRepository.addReply({
      commentId,
      content: newContent,
      owner: credentialId,
    });
    return addedReply;
  }
}
module.exports = AddReplyUseCase;

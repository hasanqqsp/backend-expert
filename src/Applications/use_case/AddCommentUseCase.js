const NewComment = require("../../Domains/comments/entities/NewComment");
class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ content: payloadContent, threadId, owner }) {
    await this._threadRepository.verifyIsThreadExists(threadId);

    const { content } = new NewComment({ content: payloadContent });
    const addedComment = await this._commentRepository.addComment({
      content,
      threadId,
      owner,
    });
    return addedComment;
  }
}
module.exports = AddCommentUseCase;

const NewComment = require("../../Domains/comments/entities/NewComment");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    await this._threadRepository.verifyIsThreadExists(payload.threadId);

    const newComment = new NewComment(payload);
    const addedComment = await this._commentRepository.addComment(newComment);
    return addedComment;
  }
}
module.exports = AddCommentUseCase;

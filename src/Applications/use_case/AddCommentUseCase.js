class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    await this._threadRepository.findThreadId(payload.threadId);

    if (!payload.content) {
      throw new Error("ADD_COMMENT.PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }
    if (typeof payload.content !== "string") {
      throw new Error("ADD_COMMENT.PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }

    const addedComment = await this._commentRepository.addComment(payload);
    return addedComment;
  }
}
module.exports = AddCommentUseCase;

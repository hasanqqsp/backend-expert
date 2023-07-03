const ReplyItem = require("../../Domains/replies/entities/ReplyItem");

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute({ threadId }) {
    await this._threadRepository.verifyIsThreadExists(threadId);
    const thread = await this._threadRepository.getByThreadId(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );
    const replies = await this._replyRepository.getRepliesByCommentsId(
      comments.map((comment) => comment.id)
    );

    return {
      ...thread,
      comments: comments.map((comment) => ({
        ...comment,
        replies: replies
          .filter((reply) => comment.id === reply.commentId)
          .map((reply) => new ReplyItem(reply)),
      })),
    };
  }
}

module.exports = GetThreadUseCase;

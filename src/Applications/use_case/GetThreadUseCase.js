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
    console.log(
      comments.map((comment) => comment.id),
      replies
    );
    // const commentsAndReplies = await Promise.all(
    //   comments.map(async (comment) => ({
    //     ...comment,
    //     replies: (
    //       await this._replyRepository.getRepliesByCommentsId(comment.id)
    //     ).replies.map((item) => ({ ...item })),
    //   }))
    // );
    console.log({
      ...thread,
      comments: comments.map((comment) => ({
        ...comment,
        replies: replies
          .filter((reply) => comment.id === reply.commentId)
          .map((reply) => new ReplyItem(reply)),
      })),
    });
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

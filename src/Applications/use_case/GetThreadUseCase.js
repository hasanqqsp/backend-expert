const ReplyItem = require("../../Domains/replies/entities/ReplyItem");

class GetThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likesCommentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likesCommentRepository = likesCommentRepository;
  }

  async execute({ threadId }) {
    await this._threadRepository.verifyIsThreadExists(threadId);
    const thread = await this._threadRepository.getByThreadId(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );
    const commentsId = comments.map((comment) => comment.id);
    const commentsLikeCount =
      await this._likesCommentRepository.getLikeCountByCommentsId(commentsId);

    const replies = await this._replyRepository.getRepliesByCommentsId(
      commentsId
    );

    return {
      ...thread,
      comments: comments.map((comment) => ({
        ...comment,
        likeCount: commentsLikeCount.find(
          (likeData) => comment.id === likeData.commentId
        )
          ? Number(
              commentsLikeCount.filter(
                (likeData) => comment.id === likeData.commentId
              )[0].count
            )
          : 0,
        replies: replies
          .filter((reply) => comment.id === reply.commentId)
          .map((reply) => new ReplyItem(reply)),
      })),
    };
  }
}

module.exports = GetThreadUseCase;

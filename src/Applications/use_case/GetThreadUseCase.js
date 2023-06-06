class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute({ threadId }) {
    await this._threadRepository.findThreadId(threadId);
    const thread = await this._threadRepository.getByThreadId(threadId);
    const { comments } = await this._commentRepository.getCommentsByThreadId(
      threadId,
    );

    const commentsAndReplies = await Promise.all(
      comments.map(async (comment) => ({
        ...comment,
        replies: (
          await this._replyRepository.getRepliesByCommentId(comment.id)
        ).replies.map((item) => ({ ...item })),
      })),
    );

    return {
      ...thread,
      comments: commentsAndReplies,
    };
  }
}

module.exports = GetThreadUseCase;

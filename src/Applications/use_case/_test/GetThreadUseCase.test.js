const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetThreadUseCase = require("../GetThreadUseCase");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const CommentItem = require("../../../Domains/comments/entities/CommentItem");
const ReplyItem = require("../../../Domains/replies/entities/ReplyItem");
const LikesCommentRepository = require("../../../Domains/likesComment/LikesCommentRepository");

describe("GetThreadUseCase", () => {
  it("should orchestrate the get thread action correctly", async () => {
    const threadId = "thread-10digit-id";
    const mockRetrievedComments = [
      new CommentItem({
        id: "comment-1",
        username: "johndoe",
        created_at: new Date("2021-08-08T07:22:33.555Z"),
        content: "sebuah comment",
        is_deleted: false,
      }),
      new CommentItem({
        id: "comment-2",
        username: "dicoding",
        created_at: new Date("2021-08-08T07:26:21.338Z"),
        content: "dua buah comment",
        is_deleted: true,
      }),
    ];
    const mockRepliesOnComments = [
      {
        id: "reply-1",
        username: "johndoe",
        created_at: new Date("2021-08-08T07:22:33.555Z"),
        content: "sebuah comment",
        is_deleted: false,
        commentId: "comment-1",
      },
    ];

    const mockRetrivedThread = new DetailThread({
      id: threadId,
      title: "sebuah thread",
      body: "sebuah body thread",
      created_at: new Date("2021-08-08T07:19:09.775Z"),
      username: "dicoding",
    });

    const mockLikeCount = [
      { count: "2", commentId: "comment-1" },
      { count: "1", commentId: "comment-2" },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikesCommentRepository = new LikesCommentRepository();
    mockThreadRepository.verifyIsThreadExists = jest.fn(() =>
      Promise.resolve()
    );
    mockThreadRepository.getByThreadId = jest.fn(() =>
      Promise.resolve(mockRetrivedThread)
    );

    mockCommentRepository.getCommentsByThreadId = jest.fn(() =>
      Promise.resolve(mockRetrievedComments)
    );

    mockReplyRepository.getRepliesByCommentsId = jest.fn(() =>
      Promise.resolve(mockRepliesOnComments)
    );

    mockLikesCommentRepository.getLikeCountByCommentsId = jest.fn(() =>
      Promise.resolve(mockLikeCount)
    );

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likesCommentRepository: mockLikesCommentRepository,
    });

    const thread = await getThreadUseCase.execute({ threadId });

    const replies = [
      new ReplyItem({
        id: "reply-1",
        username: "johndoe",
        created_at: new Date("2021-08-08T07:22:33.555Z"),
        content: "sebuah comment",
        is_deleted: false,
      }),
    ];
    const comments = [
      {
        id: "comment-1",
        username: "johndoe",
        date: new Date("2021-08-08T07:22:33.555Z"),
        content: "sebuah comment",
        replies,
        likeCount: 2,
      },
      {
        id: "comment-2",
        username: "dicoding",
        date: new Date("2021-08-08T07:26:21.338Z"),
        content: "**komentar telah dihapus**",
        replies: [],
        likeCount: 1,
      },
    ];

    expect(thread).toStrictEqual({
      id: threadId,
      title: "sebuah thread",
      body: "sebuah body thread",
      date: new Date("2021-08-08T07:19:09.775Z"),
      username: "dicoding",
      comments,
    });
    expect(mockThreadRepository.verifyIsThreadExists).toBeCalledWith(threadId);
    expect(mockThreadRepository.getByThreadId).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      threadId
    );
    expect(mockLikesCommentRepository.getLikeCountByCommentsId).toBeCalledWith([
      "comment-1",
      "comment-2",
    ]);
    expect(mockReplyRepository.getRepliesByCommentsId).toBeCalledWith([
      "comment-1",
      "comment-2",
    ]);
  });
});

const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetThreadUseCase = require("../GetThreadUseCase");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const ListComments = require("../../../Domains/comments/entities/ListComments");
const CommentItem = require("../../../Domains/comments/entities/CommentItem");
const ReplyItem = require("../../../Domains/replies/entities/ReplyItem");
const RepliesList = require("../../../Domains/replies/entities/RepliesList");

describe("GetThreadUseCase", () => {
  it("should orchestrate the get thread action correctly", async () => {
    const threadId = "thread-10digit-id";
    const mockRetrievedComments = new ListComments([
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
    ]);
    const mockRepliesOnComment = new RepliesList([
      new ReplyItem({
        id: "reply-1",
        username: "johndoe",
        created_at: new Date("2021-08-08T07:22:33.555Z"),
        content: "sebuah comment",
        is_deleted: false,
      }),
    ]);

    const mockRetrivedThread = new DetailThread({
      id: threadId,
      title: "sebuah thread",
      body: "sebuah body thread",
      created_at: new Date("2021-08-08T07:19:09.775Z"),
      username: "dicoding",
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    mockThreadRepository.verifyIsThreadExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockRetrivedThread));

    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockRetrievedComments));

    mockReplyRepository.getRepliesByCommentId = jest
      .fn()
      .mockImplementation((id) =>
        Promise.resolve(
          id === "comment-1" ? mockRepliesOnComment : new RepliesList([])
        )
      );

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const thread = await getThreadUseCase.execute({ threadId });

    const replies = [
      {
        id: "reply-1",
        username: "johndoe",
        date: new Date("2021-08-08T07:22:33.555Z"),
        content: "sebuah comment",
      },
    ];
    const comments = [
      {
        id: "comment-1",
        username: "johndoe",
        date: new Date("2021-08-08T07:22:33.555Z"),
        content: "sebuah comment",
        replies,
      },
      {
        id: "comment-2",
        username: "dicoding",
        date: new Date("2021-08-08T07:26:21.338Z"),
        content: "**komentar telah dihapus**",
        replies: [],
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
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(
      "comment-1"
    );
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(
      "comment-2"
    );
  });
});

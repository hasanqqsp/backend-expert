const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  it("should orchestrating the add user action correctly", async () => {
    const useCasePayload = {
      title: "dicoding",
      body: "secret",
      ownerId: "user-10-digitId",
    };

    const fakeOwnerId = "user-10-digitId";
    const threadId = "thread-10-digitid";
    const mockAddedThread = new AddedThread({
      id: threadId,
      title: useCasePayload.title,
      owner: fakeOwnerId,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn(() =>
      Promise.resolve(mockAddedThread)
    );

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });
    const addedThread = await getThreadUseCase.execute(useCasePayload);

    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: threadId,
        title: useCasePayload.title,
        owner: fakeOwnerId,
      })
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new AddThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        ownerId: fakeOwnerId,
      })
    );
  });
});

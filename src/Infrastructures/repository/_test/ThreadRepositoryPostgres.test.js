const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ThreadRepositoryPostgres", () => {
  // beforeEach(async () => {
  //   await ThreadsTableTestHelper.cleanTable();
  //   await UsersTableTestHelper.cleanTable();
  // });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
  });
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist added thread", async () => {
      // Arrange
      const addThread = new AddThread({
        title: "Dicoding Indonesia",
        body: "Dicoding Indonesia",
        ownerId: "user-10-digitId",
      });
      const fakeIdGenerator = () => "10digit-id"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById(
        "thread-10digit-id"
      );
      expect(threads).toHaveLength(1);
    });

    it("should return added thread correctly", async () => {
      const addThread = new AddThread({
        title: "Dicoding Indonesia",
        body: "Dicoding Indonesia",
        ownerId: "user-10-digitId",
      });
      const fakeIdGenerator = () => "10digit-id"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-10digit-id",
          title: addThread.title,
          owner: "user-10-digitId",
        })
      );
    });
  });

  describe("verifyIsThreadExists function", () => {
    it("should not throw error when given id saved in database", async () => {
      const fakeIdGenerator = () => "10-digitId";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await ThreadsTableTestHelper.addThread({});
      expect(
        threadRepositoryPostgres.verifyIsThreadExists("thread-10-digitId")
      ).resolves.not.toThrowError();
    });

    it("should throw NotFoundError when given id not saved in database", async () => {
      const fakeIdGenerator = () => {};
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      expect(
        threadRepositoryPostgres.verifyIsThreadExists("fake-bad-id")
      ).rejects.toThrowError(new NotFoundError("thread tidak ditemukan"));
    });
  });

  describe("getThreadById function", () => {
    it("should return correct data from database", async () => {
      const fakeIdGenerator = () => "";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const threadId = "thread-10digit-id";
      const username = "dicoding";
      const title = "Ini adalah Judul";
      const body = "Ini adalah Body";

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title,
        body,
      });

      const thread = await threadRepositoryPostgres.getByThreadId(threadId);

      expect(thread.id).toEqual(threadId);
      expect(thread.username).toEqual(username);
      expect(thread.title).toEqual(title);
      expect(thread.body).toEqual(body);
      expect(thread.date).toBeDefined();
    });
  });
});

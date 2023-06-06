const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist added thread', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'Dicoding Indonesia',
        body: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '10digit-id'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      const fakeOwnerId = 'user-fake-owner';
      await UsersTableTestHelper.addUser({ id: fakeOwnerId });
      // Action
      await threadRepositoryPostgres.addThread(addThread, fakeOwnerId);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById(
        'thread-10digit-id',
      );
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      const addThread = new AddThread({
        title: 'Dicoding Indonesia',
        body: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '10digit-id'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      const fakeOwnerId = 'user-fake-owner';
      await UsersTableTestHelper.addUser({ id: fakeOwnerId });
      // Action
      const addedThread = await threadRepositoryPostgres.addThread(
        addThread,
        fakeOwnerId,
      );

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-10digit-id',
          title: addedThread.title,
          owner: fakeOwnerId,
        }),
      );
    });
  });

  describe('findThreadId function', () => {
    it('should throw NotFoundError when given id not saved in database', async () => {
      const fakeIdGenerator = () => {};
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      expect(
        threadRepositoryPostgres.findThreadId('fake-bad-id'),
      ).rejects.toThrowError(new NotFoundError('thread tidak ditemukan'));
    });
    it('should not throw error when given id saved in database', async () => {
      const fakeIdGenerator = () => 'comment-10digit-id';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      await UsersTableTestHelper.addUser({ id: 'user-10digit-id' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-10digit-id',
        owner: 'user-10digit-id',
      });
      expect(
        threadRepositoryPostgres.findThreadId('thread-10digit-id'),
      ).resolves.not.toThrowError();
    });
  });

  describe('getThreadById function', () => {
    it('should return correct data from database', async () => {
      const fakeIdGenerator = () => '';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      const userId = 'user-10digit-id';
      const threadId = 'thread-10digit-id';
      const username = 'dicoding';
      const title = 'Ini adalah Judul';
      const body = 'Ini adalah Body';
      await UsersTableTestHelper.addUser({
        id: userId,
        username,
      });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title,
        body,
        owner: userId,
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

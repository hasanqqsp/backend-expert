/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const ThreadsTableTestHelper = require('./ThreadsTableTestHelper');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'dicoding',
    owner = 'user-123',
    threadId = 'thread-123',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4)',
      values: [id, content, owner, threadId],
    };

    await pool.query(query);
  },
  async addCommentAndParent({
    id = 'comment-123',
    content = 'dicoding',
    owner = 'user-123',
    threadId = 'thread-123',
    username,
  }) {
    await ThreadsTableTestHelper.addThreadAndParent({
      owner,
      id: threadId,
      username,
    });
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4)',
      values: [id, content, owner, threadId],
    };

    await pool.query(query);
  },
  async findCommentsByThreadId(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE "threadId" = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },
  async cleanTable() {
    await pool.query('DELETE FROM threads');
  },
};

module.exports = CommentsTableTestHelper;

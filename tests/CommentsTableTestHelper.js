/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");
const ThreadsTableTestHelper = require("./ThreadsTableTestHelper");

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-10-digitId",
    content = "Ini adalah Komentar",
    owner = "user-10-digitId",
    threadId = "thread-10-digitId",
  }) {
    const query = {
      text: `INSERT INTO comments (id, content, owner, "threadId") VALUES($1, $2, $3, $4)`,
      values: [id, content, owner, threadId],
    };

    await pool.query(query);
  },
  async addCommentAndParent({
    id = "comment-10-digitId",
    content = "Ini adalah Komentar",
    owner = "user-10-digitId",
    threadId = "thread-10-digitId",
    username,
  }) {
    await ThreadsTableTestHelper.addThreadAndParent({
      owner,
      id: threadId,
      username,
    });
    const query = {
      text: `INSERT INTO comments (id, content, owner, "threadId") VALUES($1, $2, $3, $4)`,
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
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async deleteCommentById(id) {
    const query = {
      text: "UPDATE comments SET is_deleted = true WHERE id = $1",
      values: [id],
    };

    await pool.query(query);
  },
  async cleanTable() {
    await pool.query("DELETE FROM threads");
  },
};

module.exports = CommentsTableTestHelper;

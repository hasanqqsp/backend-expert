/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");
const CommentsTableTestHelper = require("./CommentsTableTestHelper");

const RepliesTableTestHelper = {
  async addReply({
    id = "reply-10-digitId",
    content = "Ini adalah Balasan",
    owner = "user-10-digitId",
    commentId = "comment-10-digitId",
    date = new Date("2021-08-08T07:22:33.555Z"),
  }) {
    const query = {
      text: `INSERT INTO replies (id, content, owner, "commentId", created_at) VALUES($1, $2, $3, $4, $5)`,
      values: [id, content, owner, commentId, date],
    };

    await pool.query(query);
  },
  async addReplyAndParent({
    id = "reply-10-digitId",
    content = "Ini adalah Balasan",
    owner = "user-10-digitId",
    commentId = "comment-10-digitId",
    username = "Ini adalah Balasan",
  }) {
    await CommentsTableTestHelper.addCommentAndParent({
      owner,
      id: commentId,
      username,
    });
    const query = {
      text: "INSERT INTO replies VALUES($1, $2, $3, $4)",
      values: [id, content, owner, commentId],
    };

    await pool.query(query);
  },
  async findRepliesByThreadId(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE "commentId" = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findRepliesById(id) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async deleteReplyById(id) {
    const query = {
      text: "UPDATE replies SET is_deleted = true WHERE id = $1",
      values: [id],
    };

    await pool.query(query);
  },
  async cleanTable() {
    await pool.query("DELETE FROM replies");
  },
};

module.exports = RepliesTableTestHelper;

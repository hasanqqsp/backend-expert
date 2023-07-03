/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const LikesCommentTableTestHelper = {
  async addLike({
    commentId = "comment-10-digitId",
    userId = "user-10-digitId",
  }) {
    const query = {
      text: `INSERT INTO "likesComment" ("commentId","userId") VALUES($1, $2)`,
      values: [commentId, userId],
    };

    await pool.query(query);
  },
  async deleteLike({
    commentId = "comment-10-digitId",
    userId = "user-10-digitId",
  }) {
    const query = {
      text: `DELETE FROM "likesComment" WHERE "commentId" = $1 AND "userId" = $2`,
      values: [commentId, userId],
    };

    await pool.query(query);
  },
  async verifyIsCommentLiked({
    commentId = "comment-10-digitId",
    userId = "user-10-digitId",
  }) {
    const query = {
      text: `SELECT * FROM "likesComment" WHERE  "commentId" = $1 AND "userId"= $2`,
      values: [commentId, userId],
    };

    const { rowCount } = await pool.query(query);
    return !!rowCount;
  },

  async cleanTable() {
    await pool.query(`DELETE FROM "likesComment"`);
  },
};

module.exports = LikesCommentTableTestHelper;

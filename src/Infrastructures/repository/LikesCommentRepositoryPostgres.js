class LikesCommentRepositoryPostgres {
  constructor(pool) {
    this._pool = pool;
  }

  async verifyIsCommentLiked(commentId, userId) {
    const query = {
      text: 'SELECT * FROM "likesComment" WHERE "commentId" = $1 AND "userId" = $2',
      values: [commentId, userId],
    };

    const { rowCount } = await this._pool.query(query);
    return !!rowCount;
  }

  async addLike(commentId, userId) {
    const query = {
      text: `INSERT INTO "likesComment" ("commentId","userId") VALUES($1, $2)`,
      values: [commentId, userId],
    };
    await this._pool.query(query);
  }

  async deleteLike(commentId, userId) {
    const query = {
      text: `DELETE FROM "likesComment" WHERE "commentId" = $1 AND "userId" = $2`,
      values: [commentId, userId],
    };
    await this._pool.query(query);
  }

  async getLikeCountByCommentsId(commentsId) {
    const query = {
      text: `SELECT COUNT("commentId"),"commentId"
          FROM "likesComment"
          WHERE "commentId" = ANY($1::text[])
          GROUP BY "commentId"`,
      values: [commentsId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = LikesCommentRepositoryPostgres;

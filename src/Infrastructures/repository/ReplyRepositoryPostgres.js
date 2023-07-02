const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedReply = require("../../Domains/replies/entities/AddedReply");
const RepliesList = require("../../Domains/replies/entities/RepliesList");
const ReplyItem = require("../../Domains/replies/entities/ReplyItem");

class ReplyRepositoryPostgres {
  constructor(pool, idGenerator) {
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply({ content, owner, commentId }) {
    const id = `reply-${this._idGenerator(10)}`;
    const query = {
      text: "INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, owner, content",
      values: [id, content, owner, commentId],
    };

    const result = await this._pool.query(query);
    return new AddedReply(result.rows[0]);
  }

  async verifyIsReplyExists(id) {
    const query = {
      text: "SELECT id FROM replies WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("balasan tidak ditemukan");
    }
  }

  async verifyReplyOwner(id, owner) {
    if (!id || !owner) {
      throw new Error("VERIFY_REPLY.NOT_CONTAIN_NEEDED_PARAMETER");
    }
    const query = {
      text: "SELECT owner FROM replies WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError("anda tidak berhak mengakses resource ini");
    }
  }

  async deleteReply(id) {
    const query = {
      text: "UPDATE replies SET is_deleted = true WHERE id = $1 RETURNING is_deleted",
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0].is_deleted;
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT  r.content, 
            r.created_at, u.username, r.id, r.is_deleted
            FROM replies r JOIN users u ON u.id = r.owner 
            WHERE "commentId" = $1 ORDER BY r.created_at ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return new RepliesList(result.rows.map((item) => new ReplyItem(item)));
  }
}

module.exports = ReplyRepositoryPostgres;

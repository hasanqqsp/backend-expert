const AddedComment = require('../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const ListComments = require('../../Domains/comments/entities/ListComments');
const CommentItem = require('../../Domains/comments/entities/CommentItem');

class CommentRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment({ content, owner, threadId }) {
    const id = `comment-${this._idGenerator(10)}`;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, owner, threadId],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async findCommentId(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, ownerId) {
    if (!commentId || !ownerId) {
      throw Error('VERIFY_COMMENT.NOT_CONTAIN_NEEDED_PARAMETER');
    }
    const query = {
      text: 'SELECT id,owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (result.rows[0].owner !== ownerId) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1 RETURNING is_deleted',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0].is_deleted;
  }

  async getCommentsByThreadId(id) {
    const query = {
      text: `SELECT  CASE WHEN c.is_deleted THEN '**komentar telah dihapus**' ELSE c.content END AS content, 
              CAST(c.created_at AS TEXT) as date, u.username, c.id
              FROM comments c JOIN users u ON u.id = c.owner 
              WHERE "threadId" = $1 ORDER BY c.created_at ASC`,
      values: [id],
    };
    const result = await this._pool.query(query);
    return new ListComments(result.rows.map((row) => new CommentItem(row)));
  }
}

module.exports = CommentRepositoryPostgres;

const AddedThread = require("../../Domains/threads/entities/AddedThread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const DetailThread = require("../../Domains/threads/entities/DetailThread");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread({ title, body, ownerId }) {
    const id = `thread-${this._idGenerator(10)}`;

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner",
      values: [id, title, body, ownerId],
    };

    const { rows } = await this._pool.query(query);
    return new AddedThread(rows[0]);
  }

  async verifyIsThreadExists(id) {
    const query = {
      text: "SELECT id FROM threads WHERE id = $1",
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }
  }

  async getByThreadId(id) {
    const query = {
      text: `SELECT t.id, t.title, t.body, t.created_at, u.username 
              FROM threads t JOIN users u ON t.owner = u.id  
              WHERE t.id = $1`,
      values: [id],
    };
    const { rows } = await this._pool.query(query);
    return new DetailThread(rows[0]);
  }
}

module.exports = ThreadRepositoryPostgres;

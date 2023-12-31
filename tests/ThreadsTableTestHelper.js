/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");
const UsersTableTestHelper = require("./UsersTableTestHelper");

const ThreadsTableTestHelper = {
  async addThread({
    id = "thread-10-digitId",
    title = "Ini adalah Judul",
    body = "Ini adalah Thread",
    owner = "user-10-digitId",
  }) {
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4)",
      values: [id, title, body, owner],
    };

    await pool.query(query);
  },
  async addThreadAndParent({
    id = "thread-10-digitId",
    title = "Ini adalah Judul",
    body = "Ini adalah Thread",
    owner = "user-10-digitId",
    username,
  }) {
    await UsersTableTestHelper.addUser({ id: owner, username });
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4)",
      values: [id, title, body, owner],
    };

    await pool.query(query);
  },

  async findThreadsById(id) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
  },
};

module.exports = ThreadsTableTestHelper;

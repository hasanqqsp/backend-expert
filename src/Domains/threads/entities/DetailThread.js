/* eslint-disable camelcase */
class DetailThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, title, body, created_at, username } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = created_at;
    this.username = username;
  }

  _verifyPayload({ id, title, body, created_at, username }) {
    if (!id || !title || !body || !created_at || !username) {
      throw new Error("DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }
    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      typeof body !== "string" ||
      typeof created_at instanceof Date ||
      typeof username !== "string"
    ) {
      throw new Error("DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DetailThread;

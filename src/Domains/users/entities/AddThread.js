class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);
  }
  _verifyPayload({ title, body }) {
    if (!title || !body) {
      throw new Error("ADD_THREAD.PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }
  }
}
module.exports = AddThread;

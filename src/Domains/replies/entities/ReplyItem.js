class ReplyItem {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, username, date,
    } = payload;

    this.id = id;
    this.content = content;
    this.username = username;
    this.date = date;
  }

  _verifyPayload(payload) {
    const {
      id, content, username, date,
    } = payload;
    if (!id || !content || !username || !date) {
      throw new Error('REPLY_ITEM.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (!Object.values(payload).every((value) => typeof value === 'string')) {
      throw new Error('REPLY_ITEM.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ReplyItem;

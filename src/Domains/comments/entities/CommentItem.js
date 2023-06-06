class CommentItem {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, username, date, replies } = payload;
    this.id = id;
    this.content = content;
    this.username = username;
    this.date = date;

    this.replies = replies;
  }

  _verifyPayload(payload) {
    const { id, content, username, date } = payload;
    if (!id || !content || !username || !date) {
      throw new Error("COMMENT_ITEM.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      !Object.entries(payload).every(
        ([key, value]) => typeof value === "string" || key === "replies"
      )
    ) {
      throw new Error("COMMENT_ITEM.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CommentItem;

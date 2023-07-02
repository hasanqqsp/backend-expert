/* eslint-disable camelcase */
class CommentItem {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, username, created_at, replies, is_deleted } = payload;
    this.id = id;
    this.content = is_deleted ? "**komentar telah dihapus**" : content;
    this.username = username;
    this.date = created_at;

    this.replies = replies;
  }

  _verifyPayload(payload) {
    const { id, content, username, created_at, is_deleted } = payload;
    if (
      !id ||
      !content ||
      !username ||
      !created_at ||
      is_deleted === undefined
    ) {
      throw new Error("COMMENT_ITEM.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      !Object.entries(payload).every(
        ([key, value]) =>
          typeof value === "string" ||
          (key === "created_at" && value instanceof Date) ||
          (key === "is_deleted" && typeof value === "boolean") ||
          key === "replies"
      )
    ) {
      throw new Error("COMMENT_ITEM.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CommentItem;

class NewComment {
  constructor({ content }) {
    if (!content) {
      throw new Error("NEW_COMMENT.NOT_CONTAIN_CONTENT");
    }
    if (typeof content !== "string") {
      throw new Error("NEW_COMMENT.CONTENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
    this.content = content;
  }
}
module.exports = NewComment;

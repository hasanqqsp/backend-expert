const CommentItem = require('./CommentItem');

class ListComments {
  constructor(comments) {
    this._verifyPayload(comments);

    this.comments = comments;
  }

  _verifyPayload(payload) {
    if (!Array.isArray(payload)) {
      throw new Error('LIST_COMMENTS.PAYLOAD.IS_NOT_ARRAY');
    }

    if (!payload.every((item) => item instanceof CommentItem)) {
      throw new Error('LIST_COMMENTS.PAYLOAD.ENTITY.ONE_OF_MORE_IS_NOT_VALID');
    }
  }
}

module.exports = ListComments;

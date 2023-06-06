const ReplyItem = require('./ReplyItem');

class RepliesList {
  constructor(replies) {
    this._verifyPayload(replies);

    this.replies = replies;
  }

  _verifyPayload(payload) {
    if (!Array.isArray(payload)) {
      throw new Error('REPLIES_LIST.PAYLOAD.IS_NOT_ARRAY');
    }

    if (!payload.every((item) => item instanceof ReplyItem)) {
      throw new Error('REPLIES_LIST.PAYLOAD.ENTITY.ONE_OF_MORE_IS_NOT_VALID');
    }
  }
}

module.exports = RepliesList;

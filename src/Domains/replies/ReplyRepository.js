class ReplyRepository {
  async addReply() {
    throw Error("REPLY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyIsReplyExists() {
    throw Error("REPLY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyReplyOwner() {
    throw Error("REPLY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteReply() {
    throw Error("REPLY.METHOD_NOT_IMPLEMENTED");
  }

  async getRepliesByCommentsId() {
    throw Error("REPLY.METHOD_NOT_IMPLEMENTED");
  }
}
module.exports = ReplyRepository;

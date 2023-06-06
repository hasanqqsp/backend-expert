const AddReplyUseCase = require("../../../../Applications/use_case/AddReplyUseCase");
const DeleteReplyUseCase = require("../../../../Applications/use_case/DeleteReplyUseCase");

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const getAddReplyUseCase = this._container.getInstance(
      AddReplyUseCase.name
    );
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const addedReply = await getAddReplyUseCase.execute({
      threadId,
      commentId,
      credentialId,
      content: request.payload?.content,
    });

    const response = h.response({
      status: "success",
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request) {
    const { threadId, commentId, replyId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const getDeleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );
    await getDeleteReplyUseCase.execute({
      threadId,
      commentId,
      replyId,
      credentialId,
    });

    return {
      status: "success",
    };
  }
}

module.exports = ThreadHandler;

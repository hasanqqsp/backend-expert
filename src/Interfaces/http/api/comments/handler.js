const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const getAddCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const { threadId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const addedComment = await getAddCommentUseCase.execute({
      content: request.payload?.content || undefined,
      owner: credentialId,
      threadId,
    });

    const response = h.response({
      status: "success",
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request) {
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const getDeleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    await getDeleteCommentUseCase.execute({
      threadId,
      commentId,
      credentialId,
    });

    return {
      status: "success",
    };
  }
}

module.exports = ThreadHandler;

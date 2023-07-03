const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const GetThreadUseCase = require("../../../../Applications/use_case/GetThreadUseCase");

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const getAddThreadUseCase = this._container.getInstance(
      AddThreadUseCase.name
    );
    const { id: ownerId } = request.auth.credentials;
    const addedThread = await getAddThreadUseCase.execute({
      ...request.payload,
      ownerId,
    });

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute(request.params);

    return {
      status: "success",
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadHandler;

const AddThread = require("../../Domains/threads/entities/AddThread");

class AddThreadUseCase {
  constructor(args) {
    const { threadRepository } = args;

    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addThreadPayload = new AddThread(useCasePayload);
    return this._threadRepository.addThread(addThreadPayload);
  }
}

module.exports = AddThreadUseCase;

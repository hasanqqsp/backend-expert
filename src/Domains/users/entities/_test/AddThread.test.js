const AddThread = require("../AddThread");

describe("AddThread entities", () => {
  it("should throw error when payload didn't contain needed property", () => {
    const payloadNoBody = { title: "Test Title" };
    const payloadNoTitle = { body: "Test Body" };
    expect(() => {
      new AddThread(payloadNoBody);
    }).toThrowError("ADD_THREAD.PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(() => {
      new AddThread(payloadNoTitle);
    }).toThrowError("ADD_THREAD.PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY");
  });
});

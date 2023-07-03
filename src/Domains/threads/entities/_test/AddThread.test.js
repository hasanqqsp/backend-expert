const AddThread = require("../AddThread");

describe("AddThread entities", () => {
  it("should throw error when payload didn't contain needed property", () => {
    const payloadNoBody = { title: "Test Title", ownerId: "fake-owner-id" };
    const payloadNoTitle = { body: "Test Body", ownerId: "fake-owner-id" };
    const payloadNoOwner = { title: "Test Title", body: "Test Body" };
    expect(() => {
      new AddThread(payloadNoBody);
    }).toThrowError("ADD_THREAD.PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(() => {
      new AddThread(payloadNoTitle);
    }).toThrowError("ADD_THREAD.PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(() => {
      new AddThread(payloadNoOwner);
    }).toThrowError("ADD_THREAD.PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY");
  });
  it("should throw error when payload not meet data type spesification", () => {
    const payloadInvalidTitle = {
      title: 1234,
      body: "String",
      ownerId: "string",
    };
    const payloadInvalidBody = {
      title: "title",
      body: [""],
      ownerId: "string",
    };
    const payloadInvalidOwner = { title: "title", body: "string", ownerId: 11 };
    expect(() => {
      new AddThread(payloadInvalidTitle);
    }).toThrowError("ADD_THREAD.PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    expect(() => {
      new AddThread(payloadInvalidBody);
    }).toThrowError("ADD_THREAD.PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    expect(() => {
      new AddThread(payloadInvalidOwner);
    }).toThrowError("ADD_THREAD.PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create addThread object correctly", () => {
    // Arrange
    const payload = {
      title: "Dicoding Indonesia",
      body: "abc",
      ownerId: "fake-owner-id",
    };

    // Action
    const { body, title, ownerId } = new AddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(ownerId).toEqual(payload.ownerId);
  });
});

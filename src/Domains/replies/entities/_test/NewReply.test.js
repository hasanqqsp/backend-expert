const NewReply = require("../NewReply");

describe("a NewReply entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      contaent: "Dicoding Indonesia",
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError(
      "NEW_REPLY.NOT_CONTAIN_CONTENT"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError(
      "NEW_REPLY.CONTENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create newComment object correctly", () => {
    // Arrange
    const payload = {
      content: "Dicoding Indonesia",
    };

    // Action
    const newComment = new NewReply(payload);

    // Assert
    expect(newComment.content).toEqual(payload.content);
  });
});

const NewComment = require("../NewComment");

describe("a NewComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      content: "Dicoding Indonesia",
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 123,
      threadId: "thread-10-DigitId",
      owner: "user-10-digitId",
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create newComment object correctly", () => {
    // Arrange
    const payload = {
      content: "Dicoding Indonesia",
      threadId: "thread-10-DigitId",
      owner: "user-10-digitId",
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment.content).toEqual(payload.content);
  });
});

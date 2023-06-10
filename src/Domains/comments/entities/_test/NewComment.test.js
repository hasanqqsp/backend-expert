const NewComment = require("../NewComment");

describe("a NewComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      contaent: "Dicoding Indonesia",
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_CONTAIN_CONTENT"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.CONTENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create newComment object correctly", () => {
    // Arrange
    const payload = {
      content: "Dicoding Indonesia",
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment.content).toEqual(payload.content);
  });
});

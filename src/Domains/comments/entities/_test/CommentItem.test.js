const CommentItem = require("../CommentItem");

describe("a CommentItem entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "10digit-id",
      content: "Dicoding Indonesia",
    };

    // Action and Assert
    expect(() => new CommentItem(payload)).toThrowError(
      "COMMENT_ITEM.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "this-fake-id",
      content: "dicoding",
      username: {},
      created_at: 2005,
      is_deleted: "",
    };

    // Action and Assert
    expect(() => new CommentItem(payload)).toThrowError(
      "COMMENT_ITEM.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create commentItem object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-1",
      username: "dicoding",
      created_at: new Date("2021-08-08T07:26:21.338Z"),
      content: "komentar",
      is_deleted: true,
    };

    // Action
    const commentItem = new CommentItem(payload);

    // Assert
    expect(commentItem.id).toEqual(payload.id);
    expect(commentItem.username).toEqual(payload.username);
    expect(commentItem.date).toEqual(payload.created_at);
    expect(commentItem.content).toEqual("**komentar telah dihapus**");
  });
});

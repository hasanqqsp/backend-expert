const RepliesList = require("../RepliesList");
const ReplyItem = require("../ReplyItem");

describe("a RepliesList entities", () => {
  it("should throw error when payload is not array", () => {
    expect(() => {
      new RepliesList({});
    }).toThrowError("REPLIES_LIST.PAYLOAD.IS_NOT_ARRAY");
  });
  it("should not return error when given empty array", () => {
    expect(() => {
      new RepliesList([]);
    }).not.toThrowError();
  });
  it("should return error when given one or more entity in array is not valid reply entities", () => {
    expect(() => {
      new RepliesList([
        {
          id: "reply-id",
          content: "**balasan telah dihapus**",
          is_deleted: true,
        },
        {
          id: "reply-id",
          username: "dicodingId",
          created_at: new Date("2021-08-08T07:26:21.338Z"),
          content: "Ini adalah balasan",
          is_deleted: false,
        },
      ]);
    }).toThrowError("REPLIES_LIST.PAYLOAD.ENTITY.ONE_OF_MORE_IS_NOT_VALID");
  });
  it("should not throw error when all entity in array is valid reply entity", () => {
    expect(() => {
      new RepliesList([
        new ReplyItem({
          id: "reply-id",
          username: "dicodingId",
          created_at: new Date("2021-08-08T07:26:21.338Z"),
          content: "Ini adalah balasan",
          is_deleted: false,
        }),
        new ReplyItem({
          id: "reply-id",
          username: "dicodingId",
          created_at: new Date("2021-08-08T07:26:21.338Z"),
          content: "Ini adalah balasan 2",
          is_deleted: true,
        }),
      ]);
    }).not.toThrowError();
  });
});

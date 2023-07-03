/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("likesComment", {
    userId: {
      type: "VARCHAR(50)",
      references: "users",
      notNull: true,
    },
    commentId: {
      type: "VARCHAR(50)",
      references: "comments",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("likesComment");
};

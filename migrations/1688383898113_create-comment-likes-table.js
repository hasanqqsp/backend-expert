/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("likesComment", {
    userId: {
      type: "VARCHAR(50)",
      references: "users",
      onDelete: "CASCADE",
      notNull: true,
    },
    commentId: {
      type: "VARCHAR(50)",
      references: "comments",
      onDelete: "CASCADE",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("likesComment");
};

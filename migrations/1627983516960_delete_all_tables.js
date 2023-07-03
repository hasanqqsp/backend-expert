exports.up = (pgm) => {
  pgm.dropTable("users", { ifExists: true });
  pgm.dropTable("authentications", { ifExists: true });
  pgm.dropTable("threads", { ifExists: true });
  pgm.dropTable("comments", { ifExists: true });
  pgm.dropTable("replies", { ifExists: true });
  pgm.dropTable("likesComment", { ifExists: true });
};

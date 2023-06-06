exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(19)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      references: 'users(id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    commentId: {
      type: 'VARCHAR(50)',
      references: 'comments(id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    is_deleted: {
      type: 'BOOLEAN',
      default: false,
    },
    created_at: {
      type: 'TIMESTAMP',
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};

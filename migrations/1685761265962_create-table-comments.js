exports.up = (pgm) => {
  pgm.createTable('comments', {
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
    threadId: {
      type: 'VARCHAR(50)',
      references: 'threads(id)',
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
  pgm.dropTable('comments');
};

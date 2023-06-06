const ListComments = require('../ListComments');
const CommentItem = require('../CommentItem');

describe('a ListComments entities', () => {
  it('should throw error when payload is not array', () => {
    expect(() => {
      new ListComments({});
    }).toThrowError('LIST_COMMENTS.PAYLOAD.IS_NOT_ARRAY');
  });
  it('should not return error when given empty array', () => {
    expect(() => {
      new ListComments([]);
    }).not.toThrowError();
  });
  it('should return error when given one or more entity in array is not valid comment entities', () => {
    expect(() => {
      new ListComments([
        {
          id: 'comment-id',
          content: '**komentar telah dihapus**',
        },
        {
          id: 'comment-id',
          username: 'dicodingId',
          date: '2021-08-08T07:26:21.338Z',
          content: 'Ini adalah komentar',
        },
      ]);
    }).toThrowError('LIST_COMMENTS.PAYLOAD.ENTITY.ONE_OF_MORE_IS_NOT_VALID');
  });
  it('should not throw error when all entity in array is valid comment entity', () => {
    expect(() => {
      new ListComments([
        new CommentItem({
          id: 'comment-id',
          username: 'dicodingId',
          date: '2021-08-08T07:26:21.338Z',
          content: 'Ini adalah komentar',
        }),
        new CommentItem({
          id: 'comment-id',
          username: 'dicodingId',
          date: '2021-08-08T07:26:21.338Z',
          content: 'Ini adalah komentar 2',
        }),
      ]);
    }).not.toThrowError();
  });
});

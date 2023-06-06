const ReplyItem = require('../ReplyItem');

describe('a ReplyItem entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: '10digit-id',
      content: 'Dicoding Indonesia',
    };

    // Action and Assert
    expect(() => new ReplyItem(payload)).toThrowError(
      'REPLY_ITEM.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'this-fake-id',
      content: 'dicoding',
      username: {},
      date: 2005,
    };

    // Action and Assert
    expect(() => new ReplyItem(payload)).toThrowError(
      'REPLY_ITEM.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create replyItem object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-1',
      username: 'dicoding',
      date: '2021-08-08T07:26:21.338Z',
      content: '**balasan telah dihapus**',
    };

    // Action
    const replyItem = new ReplyItem(payload);

    // Assert
    expect(replyItem.id).toEqual(payload.id);
    expect(replyItem.username).toEqual(payload.username);
    expect(replyItem.date).toEqual(payload.date);
    expect(replyItem.content).toEqual(payload.content);
  });
});

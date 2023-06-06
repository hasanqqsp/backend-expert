const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      body: 123,
      title: 'sebuah thread',
      id: 123,
      date: 1,
      username: 1,
      comments: 1,
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('must create DetailThread object Correctly', () => {
    const payload = {
      body: 'body sebuah thread',
      title: 'sebuah thread',
      id: 'thread-123',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dandoeng',
    };

    const {
      // eslint-disable-next-line camelcase
      body,
      title,
      id,
      date,
      username,
    } = new DetailThread(payload);

    expect(body).toEqual(payload.body);
    expect(title).toEqual(payload.title);
    expect(id).toEqual(payload.id);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});

const AddThread = require('../AddThread');

describe('AddThread entities', () => {
  it("should throw error when payload didn't contain needed property", () => {
    const payloadNoBody = { title: 'Test Title' };
    const payloadNoTitle = { body: 'Test Body' };
    expect(() => {
      new AddThread(payloadNoBody);
    }).toThrowError('ADD_THREAD.PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => {
      new AddThread(payloadNoTitle);
    }).toThrowError('ADD_THREAD.PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not meet data type spesification', () => {
    const payloadInvalidTitle = { title: 1234, body: 'String' };
    const payloadInvalidBody = { title: 'title', body: [''] };
    expect(() => {
      new AddThread(payloadInvalidTitle);
    }).toThrowError('ADD_THREAD.PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => {
      new AddThread(payloadInvalidBody);
    }).toThrowError('ADD_THREAD.PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Dicoding Indonesia',
      body: 'abc',
    };

    // Action
    const { body, title } = new AddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});

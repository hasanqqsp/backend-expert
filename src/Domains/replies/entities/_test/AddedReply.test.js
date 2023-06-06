const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
  it("should throw error when payload didn't contain needed property", () => {
    const payload = {
      id: 'reply-10-digitId',
      content: 'sebuah balasan',
    };
    expect(() => {
      new AddedReply(payload);
    }).toThrowError('ADDED_REPLY.PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload data type not meet specification', () => {
    const payload = {
      id: 'reply-10-digitId',
      content: 'sebuah balasan',
      owner: {},
    };
    expect(() => {
      new AddedReply(payload);
    }).toThrowError('ADDED_REPLY.PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create addedReply object correctly', () => {
    const payload = {
      id: 'reply-10-digitId',
      content: 'sebuah balasan',
      owner: 'user-10-digitId',
    };
    const addedReply = new AddedReply(payload);
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});

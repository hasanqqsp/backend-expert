const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

async function getAccessToken(server) {
  // create user
  await server.inject({
    method: 'POST',
    url: '/users',
    payload: {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    },
  });
  // login
  const authResponse = await server.inject({
    method: 'POST',
    url: '/authentications',
    payload: {
      username: 'dicoding',
      password: 'secret',
    },
  });

  const { data } = await JSON.parse(authResponse.payload);
  return data.accessToken;
}

async function addThreadAndGetId(server, accessToken) {
  // create user
  const response = await server.inject({
    method: 'POST',
    url: '/threads',
    payload: {
      title: 'Test Title',
      body: 'Test Body',
    },
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const { data } = await JSON.parse(response.payload);
  return data.addedThread.id;
}

describe('/threads/{id}/comments endpoint', () => {
  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{id}/comments', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        content: 'Comment content',
      };

      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const threadId = await addThreadAndGetId(server, accessToken);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 404 when threadId in parameter not found in database', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: {
          content: 'content',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        contenat: 'Comment content',
      };

      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const threadId = await addThreadAndGetId(server, accessToken);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat komentar baru karena konten kosong',
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const threadId = await addThreadAndGetId(server, accessToken);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat komentar baru karena tipe data tidak sesuai',
      );
    });

    it('should response 401 when request payload not contain valid access token', async () => {
      // Arrange
      const requestPayload = {
        title: 'Dicoding Indonesia',
        body: 'Dicoding Indonesia Body',
      };
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const threadId = await addThreadAndGetId(server, accessToken);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        // headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when DELETE /threads/{id}/comments/{commentId}', () => {
    it('should response 200 and set is_deleted in database', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const threadId = await addThreadAndGetId(server, accessToken);
      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'Comment content',
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const addCommentResponseJson = JSON.parse(addCommentResponse.payload);
      const commentId = addCommentResponseJson.data.addedComment.id;
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when threadId in parameter not found in database', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/xxx/comments/xxx',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when commentId in parameter not found in database', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const threadId = await addThreadAndGetId(server, accessToken);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/xxx`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should response 401 when request payload not contain valid access token', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/xxx/comments/xxx',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });
});

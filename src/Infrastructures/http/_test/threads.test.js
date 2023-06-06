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

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        title: 'Dicoding',
        body: 'Dicoding Indonesia',
      };

      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'Dicoding Indonesia',
      };
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 123,
        body: 'Dicoding Indonesia',
      };
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai',
      );
    });

    it('should response 401 when request payload not contain valid access token', async () => {
      // Arrange
      const requestPayload = {
        title: 'Dicoding Indonesia',
        body: 'Dicoding Indonesia Body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return data', async () => {
      // Arrange

      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const threadId = await addThreadAndGetId(server, accessToken);
      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.data.thread).toBeDefined();
    });

    it('should response 401 when request payload not contain valid access token', async () => {
      // Arrange
      const requestPayload = {
        title: 'Dicoding Indonesia',
        body: 'Dicoding Indonesia Body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });
});

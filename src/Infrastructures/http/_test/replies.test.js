const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const createServer = require("../createServer");
const container = require("../../container");

async function getAccessToken(server) {
  // create user
  await server.inject({
    method: "POST",
    url: "/users",
    payload: {
      username: "dicoding",
      password: "secret",
      fullname: "Dicoding Indonesia",
    },
  });
  // login
  const authResponse = await server.inject({
    method: "POST",
    url: "/authentications",
    payload: {
      username: "dicoding",
      password: "secret",
    },
  });

  const { data } = await JSON.parse(authResponse.payload);
  return data.accessToken;
}

async function addCommentAndGetId(server, accessToken) {
  // create user
  const threadResponse = await server.inject({
    method: "POST",
    url: "/threads",
    payload: {
      title: "Test Title",
      body: "Test Body",
    },
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const { data: thread } = await JSON.parse(threadResponse.payload);
  const threadId = thread.addedThread.id;
  const commentResponse = await server.inject({
    method: "POST",
    url: `/threads/${threadId}/comments`,
    payload: {
      content: "ini adalah komentar",
    },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const { data: comment } = await JSON.parse(commentResponse.payload);
  const commentId = comment.addedComment.id;

  return [threadId, commentId];
}

describe("/threads/{id}/comments endpoint", () => {
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

  describe("when POST /threads/{id}/comments/{commentId}/replies", () => {
    it("should response 201 and persisted user", async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const [threadId, commentId] = await addCommentAndGetId(
        server,
        accessToken
      );
      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: "Reply content",
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it("should response 404 when commentId in parameter not found in database", async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const [threadId, _] = await addCommentAndGetId(server, accessToken);
      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/xxx/replies`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("komentar tidak ditemukan");
    });

    it("should response 404 when threadId in parameter not found in database", async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const [_, commentId] = await addCommentAndGetId(server, accessToken);
      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/xxx/comments/${commentId}/replies`,
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: {
          title: "Thread title",
          body: "thread body",
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan");
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const [threadId, commentId] = await addCommentAndGetId(
        server,
        accessToken
      );
      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          contenat: "Reply content",
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat balasan baru karena konten kosong"
      );
    });

    it("should response 400 when request payload not meet data type specification", async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const [threadId, commentId] = await addCommentAndGetId(
        server,
        accessToken
      );
      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 123,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat balasan baru karena tipe data tidak sesuai"
      );
    });

    it("should response 401 when request payload not contain valid access token", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/xxx/comments/xxx/replies",
        payload: {
          content: "Reply content",
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
      expect(responseJson.message).toEqual("Missing authentication");
    });
  });

  describe("when DELETE /threads/{id}/comments/{commentId}/replies/{replyId}", () => {
    it("should response 200 and set is_deleted in database", async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const [threadId, commentId] = await addCommentAndGetId(
        server,
        accessToken
      );
      const addReplyResponse = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: "reply content",
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const addReplyResponseJson = JSON.parse(addReplyResponse.payload);
      const replyId = addReplyResponseJson.data.addedReply.id;
      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 404 when replyId in parameter not found in database", async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const [threadId, commentId] = await addCommentAndGetId(
        server,
        accessToken
      );
      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/xxx`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("balasan tidak ditemukan");
    });

    it("should response 404 when commentId in parameter not found in database", async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const [threadId, _] = await addCommentAndGetId(server, accessToken);
      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/xxx/replies/xxx`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("komentar tidak ditemukan");
    });

    it("should response 404 when threadId in parameter not found in database", async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await getAccessToken(server);
      const [_, commentId] = await addCommentAndGetId(server, accessToken);
      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/xxx/comments/${commentId}/replies/xxx`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan");
    });

    it("should response 401 when request payload not contain valid access token", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/threads/xxx/comments/xxx/replies/xxx",
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
      expect(responseJson.message).toEqual("Missing authentication");
    });
  });
});

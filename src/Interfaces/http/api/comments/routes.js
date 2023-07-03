module.exports = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments",
    handler: (request, h) => handler.postCommentHandler(request, h),
    options: {
      auth: "forum-api_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}",
    handler: (request) => handler.deleteCommentHandler(request),
    options: {
      auth: "forum-api_jwt",
    },
  },
  {
    method: "PUT",
    path: "/threads/{threadId}/comments/{commentId}/likes",
    handler: (request, h) => handler.putCommentLikeHandler(request, h),
    options: {
      auth: "forum-api_jwt",
    },
  },
];

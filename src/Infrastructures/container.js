/* istanbul ignore file */

const { createContainer } = require("instances-container");

// external agency
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const Jwt = require("@hapi/jwt");
const pool = require("./database/postgres/pool");

// service (repository, helper, manager, etc)
const UserRepository = require("../Domains/users/UserRepository");
const PasswordHash = require("../Applications/security/PasswordHash");
const UserRepositoryPostgres = require("./repository/UserRepositoryPostgres");
const BcryptPasswordHash = require("./security/BcryptPasswordHash");
const ThreadRepository = require("../Domains/threads/ThreadRepository");
const ThreadRepositoryPostgres = require("./repository/ThreadRepositoryPostgres");
const CommentRepository = require("../Domains/comments/CommentRepository");
const CommentRepositoryPostgres = require("./repository/CommentRepositoryPostgres");
const ReplyRepository = require("../Domains/replies/ReplyRepository");
const ReplyRepositoryPostgres = require("./repository/ReplyRepositoryPostgres");
// use case
const AddUserUseCase = require("../Applications/use_case/AddUserUseCase");
const AddThreadUseCase = require("../Applications/use_case/AddThreadUseCase");
const AuthenticationTokenManager = require("../Applications/security/AuthenticationTokenManager");
const JwtTokenManager = require("./security/JwtTokenManager");
const LoginUserUseCase = require("../Applications/use_case/LoginUserUseCase");
const AuthenticationRepository = require("../Domains/authentications/AuthenticationRepository");
const AuthenticationRepositoryPostgres = require("./repository/AuthenticationRepositoryPostgres");
const LogoutUserUseCase = require("../Applications/use_case/LogoutUserUseCase");
const RefreshAuthenticationUseCase = require("../Applications/use_case/RefreshAuthenticationUseCase");
const AddCommentUseCase = require("../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../Applications/use_case/DeleteCommentUseCase");
const GetThreadUseCase = require("../Applications/use_case/GetThreadUseCase");
const AddReplyUseCase = require("../Applications/use_case/AddReplyUseCase");
const DeleteReplyUseCase = require("../Applications/use_case/DeleteReplyUseCase");
const LikesCommentRepository = require("../Domains/likesComment/LikesCommentRepository");
const LikesCommentRepositoryPostgres = require("./repository/LikesCommentRepositoryPostgres");
const ToggleLikeCommentUseCase = require("../Applications/use_case/ToggleLikeCommentUseCase");
// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: LikesCommentRepository.name,
    Class: LikesCommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: ReplyRepository.name,
    Class: ReplyRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "passwordHash",
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
        {
          name: "authenticationTokenManager",
          internal: AuthenticationTokenManager.name,
        },
        {
          name: "passwordHash",
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
        {
          name: "authenticationTokenManager",
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: ToggleLikeCommentUseCase.name,
    Class: ToggleLikeCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
        {
          name: "likesCommentRepository",
          internal: LikesCommentRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: GetThreadUseCase.name,
    Class: GetThreadUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
        {
          name: "replyRepository",
          internal: ReplyRepository.name,
        },
        {
          name: "likesCommentRepository",
          internal: LikesCommentRepository.name,
        },
      ],
    },
  },
  {
    key: AddReplyUseCase.name,
    Class: AddReplyUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
        {
          name: "replyRepository",
          internal: ReplyRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteReplyUseCase.name,
    Class: DeleteReplyUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "commentRepository",
          internal: CommentRepository.name,
        },
        {
          name: "threadRepository",
          internal: ThreadRepository.name,
        },
        {
          name: "replyRepository",
          internal: ReplyRepository.name,
        },
      ],
    },
  },
]);

module.exports = container;

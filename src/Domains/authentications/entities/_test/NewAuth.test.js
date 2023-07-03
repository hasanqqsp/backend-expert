const NewAuth = require("../NewAuth");

describe("NewAuth entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      accessToken: "accessToken",
    };

    // Action & Assert
    expect(() => new NewAuth(payload)).toThrowError(
      "NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      refreshToken: "refreshToken",
    };

    // Action & Assert
    expect(() => new NewAuth(payload)).toThrowError(
      "NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      accessToken: "accessToken",
      refreshToken: 1234,
    };

    // Action & Assert
    expect(() => new NewAuth(payload)).toThrowError(
      "NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create NewAuth entities correctly", () => {
    // Arrange
    const payload = {
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    };

    // Action
    const newAuth = new NewAuth(payload);

    // Assert
    expect(newAuth).toBeInstanceOf(NewAuth);
    expect(newAuth.accessToken).toEqual(payload.accessToken);
    expect(newAuth.refreshToken).toEqual(payload.refreshToken);
  });

  describe("_verifyPayload", () => {
    it("should throw an error if accessToken is missing", () => {
      // Arrange
      const payload = {
        refreshToken: "validRefreshToken",
      };

      // Act & Assert
      expect(() => NewAuth.prototype._verifyPayload(payload)).toThrowError(
        "NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY"
      );
    });

    it("should throw an error if refreshToken is missing", () => {
      // Arrange
      const payload = {
        accessToken: "validAccessToken",
      };

      // Act & Assert
      expect(() => NewAuth.prototype._verifyPayload(payload)).toThrowError(
        "NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY"
      );
    });

    it("should throw an error if accessToken has incorrect data type", () => {
      // Arrange
      const payload = {
        accessToken: 123, // Invalid data type, should be a string
        refreshToken: "validRefreshToken",
      };

      // Act & Assert
      expect(() => NewAuth.prototype._verifyPayload(payload)).toThrowError(
        "NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    });

    it("should throw an error if refreshToken has incorrect data type", () => {
      // Arrange
      const payload = {
        accessToken: "validAccessToken",
        refreshToken: 123, // Invalid data type, should be a string
      };

      // Act & Assert
      expect(() => NewAuth.prototype._verifyPayload(payload)).toThrowError(
        "NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    });
  });
});

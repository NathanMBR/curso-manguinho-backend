import jwt from "jsonwebtoken";

import {
  TokenSigner,
  TokenVerifier
} from "../../../data/protocols";

export class JWTAdapter implements
  TokenSigner.Protocol,
  TokenVerifier.Protocol
{
  constructor(
    private readonly secret: string,
    private readonly expiration?: string | number
  ) {}

  sign(request: TokenSigner.Request): TokenSigner.Response {
    const { id } = request;

    const data = request.data ?? {};

    const options: jwt.SignOptions = {
      subject: id,
      expiresIn: this.expiration
    };

    const token = jwt.sign(
      data,
      this.secret,
      options
    );

    return token;
  }

  verify(request: TokenVerifier.Request): TokenVerifier.Response {
    try {
      const { token } = request;

      const tokenData = jwt.verify(
        token,
        this.secret
      );

      const response = {
        isValid: true as const,
        tokenData: typeof tokenData === "string"
          ? {
            data: tokenData
          }
          : tokenData
      };

      return response;
    } catch (error) {
      const {
        JsonWebTokenError,
        TokenExpiredError,
        NotBeforeError
      } = jwt;

      const isJsonWebTokenError = error instanceof JsonWebTokenError;
      const isTokenExpiredError = error instanceof TokenExpiredError;
      const isNotBeforeError = error instanceof NotBeforeError;

      const isInvalidTokenError =
        isJsonWebTokenError ||
        isTokenExpiredError ||
        isNotBeforeError;

      if (isInvalidTokenError)
        return {
          isValid: false,
          error
        };

      throw error;
    }
  }
}
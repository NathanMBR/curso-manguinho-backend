import jwt from "jsonwebtoken";

import { TokenSigner } from "../../../data/protocols";

export class JWTAdapter implements TokenSigner.Protocol {
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
}
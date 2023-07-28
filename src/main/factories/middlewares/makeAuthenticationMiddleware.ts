import {
  JWT_SECRET,
  jwtExpirationTime
} from "../../config";
import { JWTAdapter } from "../../../infra/cryptography";
import { DbVerifyAccountAuthentication } from "../../../data/usecases";
import { AuthenticationMiddleware } from "../../../presentation/middlewares";
import { PinoLoggerAdapter } from "../../../infra/log";
import { ErrorHandlerMiddlewareDecorator } from "../../decorators";

export const makeAuthenticationMiddleware = () => {
  const tokenVerifier = new JWTAdapter(
    JWT_SECRET,
    jwtExpirationTime
  );

  const dbVerifyAccountAuthentication = new DbVerifyAccountAuthentication(
    tokenVerifier
  );

  const authenticationMiddleware = new AuthenticationMiddleware(
    dbVerifyAccountAuthentication
  );

  const logger = new PinoLoggerAdapter();

  const logMiddlewareDecorator = new ErrorHandlerMiddlewareDecorator(
    authenticationMiddleware,
    logger
  );

  return logMiddlewareDecorator;
};
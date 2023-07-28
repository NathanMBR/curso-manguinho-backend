import { AdminMiddleware } from "../../../presentation/middlewares";
import { PinoLoggerAdapter } from "../../../infra/log";
import { ErrorHandlerMiddlewareDecorator } from "../../decorators";

export const makeAdminMiddleware = () => {
  const adminMiddleware = new AdminMiddleware();

  const logger = new PinoLoggerAdapter();

  const logMiddlewareDecorator = new ErrorHandlerMiddlewareDecorator(
    adminMiddleware,
    logger
  );

  return logMiddlewareDecorator;
}
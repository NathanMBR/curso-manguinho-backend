import { Middleware } from "../../presentation/protocols";
import { InternalServerError } from "../../presentation/errors";
import { HttpResponseHelper } from "../../presentation/helpers";
import { Logger } from "../../data/protocols";

export class ErrorHandlerMiddlewareDecorator implements Middleware.Protocol {
  constructor(
    private readonly middleware: Middleware.Protocol,
    private readonly logger: Logger.Protocol
  ) {}

  async handle(httpRequest: Middleware.Request): Middleware.Response {
    try {
      const httpResponse = await this.middleware.handle(httpRequest);
      return httpResponse;
    } catch (error) {
      if (error instanceof Error) {
        const errorLogPayload = {
          name: error.name,
          message: error.message,
          stack: error.stack
        };

        this.logger.logError(errorLogPayload);
      }

      return {
        success: false,
        httpResponse: HttpResponseHelper.internalServerError(
          new InternalServerError()
        )
      };
    }
  }
};
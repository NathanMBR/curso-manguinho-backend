import {
  Controller,
  Logger
} from "../../presentation/protocols";
import { InternalServerError } from "../../presentation/errors";
import { HttpResponseHelper } from "../../presentation/helpers";

export class ErrorHandlerControllerDecorator implements Controller.Protocol {
  constructor(
    private readonly controller: Controller.Protocol,
    private readonly logger: Logger.Protocol
  ) {}

  async handle(httpRequest: Controller.Request) {
    try {
      const httpResponse = await this.controller.handle(httpRequest);
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

      return HttpResponseHelper.internalServerError(
        new InternalServerError()
      );
    }
  }
};
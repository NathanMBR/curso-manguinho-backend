import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { Middleware } from "../../presentation/protocols";
import { Logger } from "../../data/protocols";
import { ErrorHandlerMiddlewareDecorator } from "./ErrorHandlerMiddlewareDecorator";
import { InternalServerError } from "../../presentation/errors";

interface GetSUTEnvironmentReturn {
  middleware: Middleware.Protocol;
  logger: Logger.Protocol;

  SUT: ErrorHandlerMiddlewareDecorator;
}

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  class MiddlewareStub implements Middleware.Protocol {
    async handle(_request: Middleware.Request): Middleware.Response {
      return Promise.resolve(
        {
          success: true as const,
          httpRequest: {
            body: {
              test: "test data"
            }
          }
        }
      );
    }
  }

  class LoggerStub implements Logger.Protocol {
    logError() {}
  }

  const middleware = new MiddlewareStub();
  const logger = new LoggerStub();

  const logMiddlewareDecorator = new ErrorHandlerMiddlewareDecorator(
    middleware,
    logger
  );

  return {
    middleware,
    logger,

    SUT: logMiddlewareDecorator
  }
};

describe("ErrorHandlerMiddleware Decorator", () => {
  it("should successfully decorate middleware", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      body: {
        test: "test data"
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      success: true,
      httpRequest: {
        body: {
          test: "test data"
        }
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass http request to middleware", async () => {
    const { SUT, middleware } = getSUTEnvironment();

    const middlewareSpy = jest.spyOn(middleware, "handle");

    const SUTRequest = {
      body: {
        test: "test data"
      }
    };

    await SUT.handle(SUTRequest);

    expect(middlewareSpy).toHaveBeenCalledWith(SUTRequest);
  });

  it("should pass error to logger", async () => {
    const {
      SUT,
      middleware,
      logger
    } = getSUTEnvironment();

    const testError = new Error("Test error");

    jest.spyOn(middleware, "handle").mockImplementationOnce(
      async () => {
        throw testError;
      }
    );

    const logErrorSpy = jest.spyOn(logger, "logError");

    const SUTRequest = {
      body: {
        test: "test data"
      }
    };

    await SUT.handle(SUTRequest);

    const expectedCall = {
      name: testError.name,
      message: testError.message,
      stack: testError.stack
    };

    expect(logErrorSpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should return the same result as the middleware", async () => {
    const { SUT, middleware } = getSUTEnvironment();

    const SUTRequest = {
      body: {
        test: "test data"
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);
    const expectedResponse = await middleware.handle(SUTRequest);

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should catch middleware errors", async () => {
    const { SUT, middleware } = getSUTEnvironment();

    jest.spyOn(middleware, "handle").mockImplementationOnce(
      async () => {
        throw new Error("Test Error")
      }
    );

    const SUTRequest = {
      body: {
        test: "test data"
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      success: false,
      httpResponse: {
        statusCode: 500,
        body: new InternalServerError()
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

});
import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { Controller } from "../../presentation/protocols";
import { InternalServerError } from "../../presentation/errors";
import { Logger } from "../../data/protocols";
import { ErrorHandlerControllerDecorator } from "./ErrorHandlerControllerDecorator";

interface GetSUTEnvironmentReturn {
  controller: Controller.Protocol;
  logger: Logger.Protocol;

  SUT: ErrorHandlerControllerDecorator;
}

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  class ControllerStub implements Controller.Protocol {
    async handle() {
      return Promise.resolve(
        {
          statusCode: 200,
          body: {
            test: true
          }
        }
      );
    }
  }

  class LoggerStub implements Logger.Protocol {
    logError() {}
  }

  const controller = new ControllerStub();
  const logger = new LoggerStub();

  const logControllerDecorator = new ErrorHandlerControllerDecorator(
    controller,
    logger
  );

  return {
    controller,
    logger,

    SUT: logControllerDecorator
  }
};

describe("ErrorHandlerController Decorator", () => {
  it("should successfully decorate controller", async () => {
    const { SUT } = getSUTEnvironment();

    const httpRequest = {
      body: {
        test: "test"
      }
    };

    const SUTResponse = await SUT.handle(httpRequest);
    expect(SUTResponse).toEqual(
      {
        statusCode: 200,
        body: {
          test: true
        }
      }
    );
  });

  it("should pass http request to controller", async () => {
    const {
      controller,

      SUT
    } = getSUTEnvironment();

    const handleSpy = jest.spyOn(controller, "handle");

    const httpRequest = {
      body: {
        test: "test"
      }
    };
    await SUT.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
  
  it("should pass error to logger", async () => {
    const {
      controller,
      logger,
      
      SUT
    } = getSUTEnvironment();
    const logErrorSpy = jest.spyOn(logger, "logError");
    
    const testError = new Error("Test error");
    jest.spyOn(controller, "handle").mockImplementationOnce(
      async () => {
        throw testError;
      }
    );
    
    const httpRequest = {
      body: {
        test: "test"
      }
    };
    await SUT.handle(httpRequest);
      
    expect(logErrorSpy).toHaveBeenCalledWith(
      {
        name: testError.name,
        message: testError.message,
        stack: testError.stack
      }
    );
  });

  it("should return the same result as the controller", async () => {
    const { SUT, controller } = getSUTEnvironment();

    const httpRequest = {
      body: {
        test: "test"
      }
    };

    const controllerResponse = await controller.handle(httpRequest);
    const SUTResponse = await SUT.handle(httpRequest);

    expect(controllerResponse).toEqual(SUTResponse);
  });

  it("should catch controller errors", async () => {
    const {
      controller,
      logger,

      SUT
    } = getSUTEnvironment();

    jest.spyOn(controller, "handle").mockImplementationOnce(
      async () => {
        throw new Error("Test Error")
      }
    );

    const logErrorSpy = jest.spyOn(logger, "logError");

    const httpRequest = {
      body: {
        test: "test"
      }
    };
    const SUTResponse = await SUT.handle(httpRequest);

    expect(SUTResponse).toEqual(
      {
        statusCode: 500,
        body: new InternalServerError()
      }
    );
    expect(logErrorSpy).toHaveBeenCalledTimes(1);
  });
});
import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { PinoLoggerAdapter } from "./PinoLoggerAdapter";
import { pinoInstance } from "./pinoInstance";

interface GetSUTEnvironmentResponse {
  SUT: PinoLoggerAdapter
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  const loggerAdapter = new PinoLoggerAdapter();

  return {
    SUT: loggerAdapter
  };
};

describe("PinoLogger Adapter", () => {
  it("should successfully log error", () => {
    const { SUT } = getSUTEnvironment();
    const mockedErrorLogger = jest.fn();

    jest.spyOn(pinoInstance, "error").mockImplementationOnce(mockedErrorLogger);

    SUT.logError("Test Error Message");

    expect(mockedErrorLogger).toHaveBeenCalledTimes(1);
  });

  it("should pass string to pino error logger", () => {
    const { SUT } = getSUTEnvironment();
    const mockedErrorLogger = jest.fn();

    jest.spyOn(pinoInstance, "error").mockImplementationOnce(mockedErrorLogger);

    const errorMessage = "Test Error Message";
    SUT.logError(errorMessage);

    expect(mockedErrorLogger).toHaveBeenCalledWith(errorMessage);
  });
});
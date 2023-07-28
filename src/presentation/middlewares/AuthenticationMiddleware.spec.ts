import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import {
  MissingAuthenticationError,
  InvalidAuthenticationError
} from "../errors";
import { VerifyAccountAuthentication } from "../../domain/usecases";
import { AuthenticationMiddleware } from "./AuthenticationMiddleware";

interface GetSUTEnvironmentReturn {
  verifyAccountAuthentication: VerifyAccountAuthentication.Protocol;

  SUT: AuthenticationMiddleware;
}

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  class VerifyAccountAuthenticationStub implements VerifyAccountAuthentication.Protocol {
    verify(_request: VerifyAccountAuthentication.Request): VerifyAccountAuthentication.Response {
      return {
        isAuthenticationValid: true,
        authenticationData: {
          sub: "test-id",
          email: "test@email.com",
          type: "COMMON"
        }
      }
    }
  }

  const verifyAccountAuthentication = new VerifyAccountAuthenticationStub();

  const authenticationMiddleware = new AuthenticationMiddleware(
    verifyAccountAuthentication
  );

  return {
    verifyAccountAuthentication,

    SUT: authenticationMiddleware
  };
};

describe("Authentication Middleware", () => {
  it("should successfully handle request", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      headers: {
        authorization: "Bearer test-token"
      },
      body: {
        test: "test data"
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      success: true,
      httpRequest: {
        headers: {
          authorization: "Bearer test-token"
        },

        body: {
          test: "test data"
        },

        authenticationData: {
          id: "test-id",
          email: "test@email.com",
          type: "COMMON"
        }
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return error if no headers are provided", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      // headers: {
      //   authorization: "Bearer test-token"
      // },
      body: {
        test: "test data"
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      success: false,
      httpResponse: {
        statusCode: 401,
        body: new MissingAuthenticationError()
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return error if no authorization header is provided", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      headers: {
        // authorization: "Bearer test-token"
      },
      body: {
        test: "test data"
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      success: false,
      httpResponse: {
        statusCode: 401,
        body: new MissingAuthenticationError()
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return error if token isn't bearer type", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      headers: {
        authorization: "Non-bearer test-token"
      },
      body: {
        test: "test data"
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      success: false,
      httpResponse: {
        statusCode: 401,
        body: new InvalidAuthenticationError("Authentication token must be a Bearer token")
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return error if no token is provided", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      headers: {
        authorization: "Bearer"
      },
      body: {
        test: "test data"
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      success: false,
      httpResponse: {
        statusCode: 401,
        body: new MissingAuthenticationError()
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return error if verify account authentication returns error", async () => {
    const { SUT, verifyAccountAuthentication } = getSUTEnvironment();

    jest.spyOn(verifyAccountAuthentication, "verify").mockReturnValueOnce(
      {
        isAuthenticationValid: false,
        error: new Error("Test error")
      }
    );

    const SUTRequest = {
      headers: {
        authorization: "Bearer test-token"
      },
      body: {
        test: "test data"
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      success: false,
      httpResponse: {
        statusCode: 401,
        body: new InvalidAuthenticationError("Authentication token is invalid, expired or not allowed yet")
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass token to verify account authentication call", async () => {
    const { SUT, verifyAccountAuthentication } = getSUTEnvironment();

    const verifySpy = jest.spyOn(verifyAccountAuthentication, "verify");

    const SUTRequest = {
      headers: {
        authorization: "Bearer test-token"
      },
      body: {
        test: "test data"
      }
    };

    await SUT.handle(SUTRequest);

    const expectedCall = {
      token: "test-token"
    };

    expect(verifySpy).toHaveBeenCalledWith(expectedCall);
  });

  it("should repass verify account authentication errors to upper level", async () => {
    const { SUT, verifyAccountAuthentication } = getSUTEnvironment();

    jest.spyOn(verifyAccountAuthentication, "verify").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      headers: {
        authorization: "Bearer test-token"
      },
      body: {
        test: "test data"
      }
    };

    const SUTResponse = SUT.handle(SUTRequest);


    await expect(SUTResponse).rejects.toThrow();
  });
});
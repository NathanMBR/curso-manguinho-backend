import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import {
  MissingAuthenticationError,
  PermissionDeniedError
} from "../errors";
import { AdminMiddleware } from "./AdminMiddleware";

interface GetSUTEnvironmentReturn {
  SUT: AdminMiddleware;
}

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  const adminMiddleware = new AdminMiddleware();

  return {
    SUT: adminMiddleware
  };
};

describe("Admin Middleware", () => {
  it("should successfully handle request", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      authenticationData: {
        id: "test-id",
        email: "test@email.com",
        type: "ADMIN" as const
      },

      body: {
        test: "test data"
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      success: true,
      httpRequest: SUTRequest
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return error if no authentication data is provided", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      // authenticationData: {
      //   id: "test-id",
      //   email: "test@email.com",
      //   type: "ADMIN" as const
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

  it("should return error if authentication data type isn't 'ADMIN'", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      authenticationData: {
        id: "test-id",
        email: "test@email.com",
        type: "COMMON" as const
      },

      body: {
        test: "test data"
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);

    const expectedResponse = {
      success: false,
      httpResponse: {
        statusCode: 403,
        body: new PermissionDeniedError()
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });
});
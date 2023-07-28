import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";
import jwt from "jsonwebtoken";

import { JWTAdapter } from "./JWTAdapter";

interface GetSUTEnvironmentResponse {
  secret: string;
  expiration?: string | number;

  SUT: JWTAdapter;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  const secret = "test-secret";
  const expiration = "test-expiration";

  const SUT = new JWTAdapter(
    secret,
    expiration
  );

  return {
    secret,
    expiration,

    SUT
  };
};

jest.spyOn(jwt, "sign").mockImplementation(
  () => "test-token"
);

jest.spyOn(jwt, "verify").mockImplementation(
  () => (
    {
      test: "test data"
    }
  )
);

describe("JWT Adapter Sign Method", () => {
  it("should successfully sign a token", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      id: "test-id",
      data: {
        test: "test data"
      }
    };
    
    const SUTResponse = SUT.sign(SUTRequest);

    expect(SUTResponse).toBe("test-token");
  });

  it("should successfully sign a token without data", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      id: "test-id"
    };
    
    const SUTResponse = SUT.sign(SUTRequest);

    expect(SUTResponse).toBe("test-token");
  });

  it("should successfully sign a token without expiration", () => {
    const { secret } = getSUTEnvironment();
    const SUT = new JWTAdapter(secret);

    const SUTRequest = {
      id: "test-id"
    };
    
    const SUTResponse = SUT.sign(SUTRequest);

    expect(SUTResponse).toBe("test-token");
  });

  it("should pass id, data, secret and expiration to jwt sign method", () => {
    const {
      SUT,
      secret,
      expiration
    } = getSUTEnvironment();

    const signSpy = jest.spyOn(jwt, "sign");

    const SUTRequest = {
      id: "test-id",
      data: {
        test: "test data"
      }
    };

    SUT.sign(SUTRequest);

    expect(signSpy).toHaveBeenCalledWith(
      {
        test: SUTRequest.data.test
      },

      secret,

      {
        subject: SUTRequest.id,
        expiresIn: expiration
      }
    );
  });

  it("should repass jwt sign method errors to upper level", () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(jwt, "sign").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      id: "test-id",
      data: {
        test: "test data"
      }
    };
    
    const getSUTResponse = () => SUT.sign(SUTRequest);

    expect(getSUTResponse).toThrow();
  });
});

describe("JWT Adapter Verify Method", () => {
  it("should successfully verify a token", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      token: "test-token"
    };

    const SUTResponse = SUT.verify(SUTRequest);

    const expectedResponse = {
      isValid: true,
      tokenData: {
        test: "test data"
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass token and secret to jwt verify method", () => {
    const { SUT, secret } = getSUTEnvironment();

    const verifySpy = jest.spyOn(jwt, "verify");

    const SUTRequest = {
      token: "test-token"
    };

    SUT.verify(SUTRequest);

    const expectedCall = [
      SUTRequest.token,
      secret
    ];

    expect(verifySpy).toHaveBeenCalledWith(...expectedCall);
  });

  it("should repass generic jwt verify method errors to upper level", () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(jwt, "verify").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      token: "test-token"
    };

    const getSUTResponse = () => SUT.verify(SUTRequest);

    expect(getSUTResponse).toThrow();
  });

  it("should catch error if is instance of jwt json web token error", () => {
    const { SUT } = getSUTEnvironment();
    const jsonWebTokenError = new jwt.JsonWebTokenError("Test error");

    jest.spyOn(jwt, "verify").mockImplementationOnce(
      () => {
        throw jsonWebTokenError;
      }
    );

    const SUTRequest = {
      token: "test-token"
    };

    const getSUTResponse = () => SUT.verify(SUTRequest);
    const SUTResponse = getSUTResponse();
    const expectedResponse = {
      isValid: false,
      error: jsonWebTokenError
    };

    expect(getSUTResponse).not.toThrow();
    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should catch error if is instance of jwt token expired error", () => {
    const { SUT } = getSUTEnvironment();
    const tokenExpiredError = new jwt.TokenExpiredError(
      "Test error",
      new Date()
    );

    jest.spyOn(jwt, "verify").mockImplementationOnce(
      () => {
        throw tokenExpiredError;
      }
    );

    const SUTRequest = {
      token: "test-token"
    };

    const getSUTResponse = () => SUT.verify(SUTRequest);
    const SUTResponse = getSUTResponse();
    const expectedResponse = {
      isValid: false,
      error: tokenExpiredError
    };

    expect(getSUTResponse).not.toThrow();
    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should catch error if is instance of jwt not before error", () => {
    const { SUT } = getSUTEnvironment();
    const notBeforeError = new jwt.NotBeforeError(
      "Test error",
      new Date()
    );

    jest.spyOn(jwt, "verify").mockImplementationOnce(
      () => {
        throw notBeforeError;
      }
    );

    const SUTRequest = {
      token: "test-token"
    };

    const getSUTResponse = () => SUT.verify(SUTRequest);
    const SUTResponse = getSUTResponse();
    const expectedResponse = {
      isValid: false,
      error: notBeforeError
    };

    expect(getSUTResponse).not.toThrow();
    expect(SUTResponse).toEqual(expectedResponse);
  });
});
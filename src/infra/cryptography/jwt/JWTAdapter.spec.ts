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

describe("JWT Adapter Sign Method", () => {
  it("should successfully sign a token", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      id: "test-id",
      data: {
        test: "test-data"
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
    const { secret} = getSUTEnvironment();
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
        test: "test-data"
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
        test: "test-data"
      }
    };
    
    const getSUTResponse = async () => SUT.sign(SUTRequest);

    expect(getSUTResponse).rejects.toThrow();
  });
});
import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { TokenVerifier } from "../../protocols";
import { DbVerifyAccountAuthentication } from "./DbVerifyAccountAuthentication";

interface GetSUTEnvironmentResponse {
  tokenVerifier: TokenVerifier.Protocol;

  SUT: DbVerifyAccountAuthentication;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  class TokenVerifierStub implements TokenVerifier.Protocol {
    verify(request: TokenVerifier.Request): TokenVerifier.Response {
      return {
        isValid: true,
        tokenData: {
          id: "test-id"
        }
      }
    }
  }

  const tokenVerifier = new TokenVerifierStub();

  const dbVerifyAccountAuthentication = new DbVerifyAccountAuthentication(
    tokenVerifier
  );

  return {
    tokenVerifier,

    SUT: dbVerifyAccountAuthentication
  };
};

describe("DbVerifyAccountAuthentication UseCase", () => {
  it("should successfully verify an account authentication", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      token: "test-token"
    };

    const SUTResponse = SUT.verify(SUTRequest);

    const expectedResponse = {
      isAuthenticationValid: true,
      authenticationData: {
        id: "test-id"
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return error response if token verifier returns error", () => {
    const { SUT, tokenVerifier } = getSUTEnvironment();

    jest.spyOn(tokenVerifier, "verify").mockReturnValueOnce(
      {
        isValid: false,
        error: new Error("Test error")
      }
    );

    const SUTRequest = {
      token: "test-token"
    };

    const SUTResponse = SUT.verify(SUTRequest);

    const expectedResponse = {
      isAuthenticationValid: false,
      error: new Error("Test error")
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass token to token verifier call", () => {
    const { SUT, tokenVerifier } = getSUTEnvironment();

    const verifySpy = jest.spyOn(tokenVerifier, "verify");

    const SUTRequest = {
      token: "test-token"
    };

    SUT.verify(SUTRequest);

    expect(verifySpy).toHaveBeenCalledWith(SUTRequest);
  });

  it("should repass token verify errors to upper level", () => {
    const { SUT, tokenVerifier } = getSUTEnvironment();

    jest.spyOn(tokenVerifier, "verify").mockImplementationOnce(
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
});
import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { TokenSigner } from "../protocols";
import { DbAuthenticateAccount } from "./DbAuthenticateAccount";

interface GetSUTEnvironmentResponse {
  tokenSigner: TokenSigner.Protocol;

  SUT: DbAuthenticateAccount;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  class TokenSignerStub implements TokenSigner.Protocol {
    sign(_request: TokenSigner.Request): TokenSigner.Response {
      return "test-token";
    }
  }

  const tokenSigner = new TokenSignerStub();

  const SUT = new DbAuthenticateAccount(
    tokenSigner
  );

  return {
    tokenSigner,

    SUT
  };
};

describe("DbAuthenticateAccount UseCase", () => {
  it("should successfully authenticate an account", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      id: "test-id",
      name: "Test Name",
      email: "test@email.com",
      password: "test1234",
      type: "COMMON"
    } as const;

    const SUTResponse = SUT.authenticate(SUTRequest);
    const expectedResponse = "test-token";

    expect(SUTResponse).toBe(expectedResponse);
  });

  it("should pass id and data to token signer call", () => {
    const { SUT, tokenSigner } = getSUTEnvironment();

    const signSpy = jest.spyOn(tokenSigner, "sign");

    const SUTRequest = {
      id: "test-id",
      name: "Test Name",
      email: "test@email.com",
      password: "test1234",
      type: "COMMON"
    } as const;

    SUT.authenticate(SUTRequest);

    const expectedToBeCalledWith = {
      id: SUTRequest.id,
      data: {
        name: SUTRequest.name,
        email: SUTRequest.email
      }
    };

    expect(signSpy).toBeCalledWith(expectedToBeCalledWith);
  });

  it("should not pass password to token signer call", () => {
    const { SUT, tokenSigner } = getSUTEnvironment();

    const signSpy = jest.spyOn(tokenSigner, "sign");

    const SUTRequest = {
      id: "test-id",
      name: "Test Name",
      email: "test@email.com",
      password: "test1234",
      type: "COMMON"
    } as const;

    SUT.authenticate(SUTRequest);

    const expectedToBeCalledWith = {
      id: SUTRequest.id,
      data: {
        name: SUTRequest.name,
        email: SUTRequest.email,
        password: SUTRequest.password
      }
    };

    expect(signSpy).not.toBeCalledWith(expectedToBeCalledWith);
  });

  it("should repass sign errors to upper level", async () => {
    const { SUT, tokenSigner } = getSUTEnvironment();

    jest.spyOn(tokenSigner, "sign").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      id: "test-id",
      name: "Test Name",
      email: "test@email.com",
      password: "test1234",
      type: "COMMON"
    } as const;

    const getSUTResponse = () => SUT.authenticate(SUTRequest);

    expect(getSUTResponse).toThrow();
  });
});
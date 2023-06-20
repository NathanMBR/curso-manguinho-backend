import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { DbAddAccount } from "./DbAddAccount";
import { Encrypter } from "../protocols";

interface GetSUTEnvironmentResponse {
  SUT: DbAddAccount,
  encrypter: Encrypter.Protocol
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  class EncrypterStub implements Encrypter.Protocol {
    async encrypt(value: string) {
      return Promise.resolve("hashed_value");
    }
  }

  const encrypter = new EncrypterStub();
  const addAccount = new DbAddAccount(encrypter);

  return {
    encrypter,

    SUT: addAccount
  };
}

describe("DbAddAccount UseCase", () => {
  it("should pass password to encrypter call", async () => {
    const { SUT, encrypter } = getSUTEnvironment();

    const encryptSpy = jest.spyOn(encrypter, "encrypt");
    const accountData = {
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    };

    await SUT.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith(accountData.password);
  });

  it("should not have a 'try/catch' statement", async () => {
    const { SUT, encrypter } = getSUTEnvironment();

    jest.spyOn(encrypter, "encrypt").mockImplementation(
      () => {
        throw new Error();
      }
    );

    const accountData = {
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    };

    const SUTResponse = SUT.add(accountData);
    await expect(SUTResponse).rejects.toThrow();
  })
});
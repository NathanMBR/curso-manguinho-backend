import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { DbAddAccount } from "./DbAddAccount";
import {
  AddAccountRepository,
  Encrypter
} from "../protocols";

interface GetSUTEnvironmentResponse {
  encrypter: Encrypter.Protocol;
  addAccountRepository: AddAccountRepository.Protocol;

  SUT: DbAddAccount;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  class EncrypterStub implements Encrypter.Protocol {
    async encrypt(value: string) {
      return Promise.resolve("hashed_value");
    }
  }

  class AddAccountRepositoryStub implements AddAccountRepository.Protocol {
    async add(account: AddAccountRepository.Request) {
      return Promise.resolve(
        {
          id: "test_id",
          name: "Test Name",
          email: "test@email.com",
          password: "test1234"
        }
      );
    }
  }

  const encrypter = new EncrypterStub();
  const addAccountRepository = new AddAccountRepositoryStub();
  const addAccount = new DbAddAccount(
    encrypter,
    addAccountRepository
  );

  return {
    encrypter,
    addAccountRepository,

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

  it("should pass account data with hashed password to add account repository call", async () => {
    const {
      SUT,
      addAccountRepository,
      encrypter
    } = getSUTEnvironment();

    const addSpy = jest.spyOn(addAccountRepository, "add");
    const accountData = {
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    };

    await SUT.add(accountData);

    const hashedPassword = await encrypter.encrypt(accountData.password);
    expect(addSpy).toHaveBeenCalledWith(
      {
        ...accountData,
        password: hashedPassword
      }
    );
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
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
} from "../../protocols";

interface GetSUTEnvironmentResponse {
  encrypter: Encrypter.Protocol;
  addAccountRepository: AddAccountRepository.Protocol;

  SUT: DbAddAccount;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  class EncrypterStub implements Encrypter.Protocol {
    async encrypt(_value: string) {
      return Promise.resolve("hashed_value");
    }
  }

  class AddAccountRepositoryStub implements AddAccountRepository.Protocol {
    async add(_account: AddAccountRepository.Request) {
      return Promise.resolve(
        {
          id: "test_id",
          name: "Test Name",
          email: "test@email.com",
          password: "test1234",
          type: "COMMON" as const
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
  it("should successfully add an account", async () => {
    const { SUT } = getSUTEnvironment();

    const accountData = {
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    };

    const SUTResponse = await SUT.add(accountData);

    expect(SUTResponse).toEqual(
      {
        id: "test_id",
        name: "Test Name",
        email: "test@email.com",
        password: "test1234",
        type: "COMMON"
      }
    );
  });

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

  it("should repass encrypter errors to upper level", async () => {
    const { SUT, encrypter } = getSUTEnvironment();

    jest.spyOn(encrypter, "encrypt").mockImplementationOnce(
      async () => {
        throw new Error("Test error");
      }
    );

    const accountData = {
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    };

    const SUTResponse = SUT.add(accountData);
    await expect(SUTResponse).rejects.toThrow();
  });

  it("should repass add account repository errors to upper level", async () => {
    const { SUT, addAccountRepository } = getSUTEnvironment();

    jest.spyOn(addAccountRepository, "add").mockImplementationOnce(
      async () => {
        throw new Error("Test error");
      }
    );

    const accountData = {
      name: "Test Name",
      email: "test@email.com",
      password: "test1234"
    };

    const SUTResponse = SUT.add(accountData);
    await expect(SUTResponse).rejects.toThrow();
  });
});
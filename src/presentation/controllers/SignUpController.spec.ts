import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import {
  ValidationError,
  EmailAlreadyExistsError
} from "../errors";
import { Validator } from "../protocols";
import {
  FindOneAccountByEmail,
  AddAccount
} from "../../domain/usecases";

import { SignUpController } from "./SignUpController";

interface GetSUTEnvironmentReturn {
  validator: Validator.Protocol;

  findOneAccountByEmail: FindOneAccountByEmail.Protocol;
  addAccount: AddAccount.Protocol;

  SUT: SignUpController;
}

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  // "stub mock": a mock that returns a fixed/constant value
  class ValidatorStub implements Validator.Protocol {
    validate(_data: Validator.Request): Validator.Response {
      return {
        isValid: true
      };
    }
  }

  class FindOneAccountByEmailStub implements FindOneAccountByEmail.Protocol {
    async findOneByEmail(_account: FindOneAccountByEmail.Request): FindOneAccountByEmail.Response {
      return Promise.resolve(null);
    }
  }

  class AddAccountSub implements AddAccount.Protocol {
    async add(_account: AddAccount.Request): AddAccount.Response {
      const fakeAccount = {
        id: "test_id",
        name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      };

      return fakeAccount;
    }
  }

  const validator = new ValidatorStub();
  const findOneAccountByEmail = new FindOneAccountByEmailStub();
  const addAccount = new AddAccountSub();

  const signUpController = new SignUpController(
    validator,
    findOneAccountByEmail,
    addAccount
  );

  return {
    validator,
    findOneAccountByEmail,
    addAccount,
    SUT: signUpController
  };
};

describe("SignUp Controller", () => {
  it("should successfully handle request", async () => {
    const { SUT } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);
    expect(SUTResponse.statusCode).toBe(200);
    expect(SUTResponse.body).toEqual(
      {
        id: "test_id",
        name: SUTRequest.body.name,
        email: SUTRequest.body.email
      }
    );
  });

  it("should not return password in the response body", async () => {
    const { SUT } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      }
    };

    const SUTResponse = await SUT.handle(SUTRequest);
    expect(SUTResponse.body).not.toHaveProperty("password");
  });

  it("should return 400 if body is invalid", async () => {
    const { SUT, validator } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      }
    };

    jest.spyOn(validator, "validate").mockReturnValueOnce(
      {
        isValid: false,
        errorMessage: "Test error"
      }
    );

    const SUTResponse = await SUT.handle(SUTRequest);
    expect(SUTResponse.statusCode).toBe(400);
    expect(SUTResponse.body).toEqual(new ValidationError("Test error"));
  });

  it("should return 400 if email already exists", async () => {
    const { SUT, findOneAccountByEmail } = getSUTEnvironment();
    
    jest.spyOn(findOneAccountByEmail, "findOneByEmail").mockReturnValueOnce(
      Promise.resolve(
        {
          id: "existent_id",
          name: "Existent Test User",
          email: "existent@test.com",
          password: "existent1234"
        }
      )
    );

    const SUTRequest = {
      body: {
        name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      }
    };
    const SUTResponse = await SUT.handle(SUTRequest);
    expect(SUTResponse.statusCode).toBe(400);
    expect(SUTResponse.body).toEqual(new EmailAlreadyExistsError());
  });

  it("should pass body to sign up validator call", async () => {
    const { SUT, validator } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      }
    };
    const isValidSpy = jest.spyOn(validator, "validate");

    await SUT.handle(SUTRequest);

    // ensure validator receives the correct parameters
    expect(isValidSpy).toHaveBeenCalledWith(SUTRequest.body);
  });

  it("should pass email to find one account by email call", async () => {
    const { SUT, findOneAccountByEmail } = getSUTEnvironment();
    const findOneByEmailSpy = jest.spyOn(findOneAccountByEmail, "findOneByEmail");

    const SUTRequest = {
      body: {
        name: "Test",
        email: "test@email.com",
        password: "test"
      }
    };
    await SUT.handle(SUTRequest);

    expect(findOneByEmailSpy).toHaveBeenCalledWith(
      {
        email: SUTRequest.body.email
      }
    );
  });

  it("should pass body to add account call", async () => {
    const { SUT, addAccount } = getSUTEnvironment();
    const SUTRequest = {
      body: {
        name: "Test",
        email: "test@email.com",
        password: "test"
      }
    };

    const addSpy = jest.spyOn(addAccount, "add");

    await SUT.handle(SUTRequest);

    expect(addSpy).toHaveBeenCalledWith(SUTRequest.body);
  });

  it("should repass sign up validator errors to upper level", async () => {
    const { SUT, validator } = getSUTEnvironment();

    const SUTRequest = {
      body: {
        name: "Test",
        email: "test@email.com",
        password: "test"
      }
    };

    jest.spyOn(validator, "validate").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTResponse = SUT.handle(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });

  it("should repass find one account by email errors to upper level", async () => {
    const { SUT, findOneAccountByEmail } = getSUTEnvironment();

    const SUTRequest = {
      body: {
        name: "Test",
        email: "test@email.com",
        password: "test"
      }
    };

    jest.spyOn(findOneAccountByEmail, "findOneByEmail").mockImplementationOnce(
      async () => {
        throw new Error("Test error");
      }
    );

    const SUTResponse = SUT.handle(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });

  it("should repass add account errors to upper level", async () => {
    const { SUT, addAccount } = getSUTEnvironment();

    const SUTRequest = {
      body: {
        name: "Test",
        email: "test@email.com",
        password: "test"
      }
    };

    jest.spyOn(addAccount, "add").mockImplementationOnce(
      async () => {
        throw new Error("Test error");
      }
    );

    const SUTResponse = SUT.handle(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });
});
import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import {
  MissingParamError,
  InvalidParamError,
  EmailAlreadyExistsError
} from "../errors";
import { EmailValidator } from "../protocols";
import {
  FindOneAccountByEmail,
  AddAccount
} from "../../domain/usecases";

import { SignUpController } from "./SignUpController";

interface GetSUTEnvironmentReturn {
  emailValidator: EmailValidator.Protocol;

  findOneAccountByEmail: FindOneAccountByEmail.Protocol;
  addAccount: AddAccount.Protocol;

  SUT: SignUpController;
}

const getSUTEnvironment = (): GetSUTEnvironmentReturn => {
  // "stub mock": a mock that returns a fixed/constant value
  class EmailValidatorStub implements EmailValidator.Protocol {
    isValid(_email: string): boolean {
      return true;
    }
  }

  class FindOneAccountByEmailStub implements FindOneAccountByEmail.Protocol {
    async findOneByEmail(account: FindOneAccountByEmail.Request): FindOneAccountByEmail.Response {
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

  const emailValidator = new EmailValidatorStub();
  const findOneAccountByEmail = new FindOneAccountByEmailStub();
  const addAccount = new AddAccountSub();

  const signUpController = new SignUpController(
    emailValidator,
    findOneAccountByEmail,
    addAccount
  );

  return {
    emailValidator,
    findOneAccountByEmail,
    addAccount,
    SUT: signUpController
  };
};

describe("SignUp Controller", () => {
  it("should successfully handle request", async () => {
    const { SUT } = getSUTEnvironment();
    const httpRequest = {
      body: {
        name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      }
    };

    const SUTResponse = await SUT.handle(httpRequest);
    expect(SUTResponse.statusCode).toBe(200);
    expect(SUTResponse.body).toEqual(
      {
        id: "test_id",
        name: httpRequest.body.name,
        email: httpRequest.body.email
      }
    );
  });

  it("should not return password in the response body", async () => {
    const { SUT } = getSUTEnvironment();
    const httpRequest = {
      body: {
        name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      }
    };

    const SUTResponse = await SUT.handle(httpRequest);
    expect(SUTResponse.body).not.toHaveProperty("password");
  });

  it("should return 400 if no name is provided", async () => {
    const { SUT } = getSUTEnvironment();
    const httpRequest = {
      body: {
        // name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      }
    };

    const SUTResponse = await SUT.handle(httpRequest);
    expect(SUTResponse.statusCode).toBe(400);
    expect(SUTResponse.body).toEqual(new MissingParamError("name"));
  });

  it("should return 400 if no email is provided", async () => {
    const { SUT } = getSUTEnvironment();
    const httpRequest = {
      body: {
        name: "Test Name",
        // email: "test@email.com",
        password: "test1234"
      }
    };

    const SUTResponse = await SUT.handle(httpRequest);
    expect(SUTResponse.statusCode).toBe(400);
    expect(SUTResponse.body).toEqual(new MissingParamError("email"));
  });

  it("should return 400 if no password is provided", async () => {
    const { SUT } = getSUTEnvironment();
    const httpRequest = {
      body: {
        name: "Test Name",
        email: "test@email.com",
        // password: "test1234"
      }
    };

    const SUTResponse = await SUT.handle(httpRequest);
    expect(SUTResponse.statusCode).toBe(400);
    expect(SUTResponse.body).toEqual(new MissingParamError("password"));
  });

  it("should return 400 if email format is invalid", async () => {
    const { SUT, emailValidator } = getSUTEnvironment();
    const httpRequest = {
      body: {
        name: "Test Name",
        email: "invalid-email",
        password: "test1234"
      }
    };

    // Injects a return value to a function
    jest.spyOn(emailValidator, "isValid").mockReturnValueOnce(false);

    const SUTResponse = await SUT.handle(httpRequest);
    expect(SUTResponse.statusCode).toBe(400);
    expect(SUTResponse.body).toEqual(new InvalidParamError("email"));
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

    const httpRequest = {
      body: {
        name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      }
    };
    const SUTResponse = await SUT.handle(httpRequest);
    expect(SUTResponse.statusCode).toBe(400);
    expect(SUTResponse.body).toEqual(new EmailAlreadyExistsError());
  });

  it("should pass email to email validator call", async () => {
    const { SUT, emailValidator } = getSUTEnvironment();
    const httpRequest = {
      body: {
        name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      }
    };
    const isValidSpy = jest.spyOn(emailValidator, "isValid");

    await SUT.handle(httpRequest);

    // ensure validator receives the correct parameters
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  it("should pass email to find one account by email call", async () => {
    const { SUT, findOneAccountByEmail } = getSUTEnvironment();
    const findOneByEmailSpy = jest.spyOn(findOneAccountByEmail, "findOneByEmail");

    const httpRequest = {
      body: {
        name: "Test",
        email: "test@email.com",
        password: "test"
      }
    };
    await SUT.handle(httpRequest);

    expect(findOneByEmailSpy).toHaveBeenCalledWith(
      {
        email: httpRequest.body.email
      }
    );
  });

  it("should pass body to add account call", async () => {
    const { SUT, addAccount } = getSUTEnvironment();
    const httpRequest = {
      body: {
        name: "Test",
        email: "test@email.com",
        password: "test"
      }
    };

    const addSpy = jest.spyOn(addAccount, "add");

    await SUT.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  });
});
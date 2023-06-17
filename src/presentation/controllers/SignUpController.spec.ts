import {
  describe,
  it,
  expect
} from "@jest/globals";

import { SignUpController } from "./SignUpController";

describe("SignUp Controller", () => {
  it("should return 400 if no name is provided", () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        // name: "Test Name",
        email: "test@email.com",
        password: "test1234"
      }
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error("Missing parameter: name"));
  });

  it("should return 400 if no email is provided", () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: "Test Name",
        // email: "test@email.com",
        password: "test1234"
      }
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error("Missing parameter: email"));
  });

  it("should return 400 if no password is provided", () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: "Test Name",
        email: "test@email.com",
        // password: "test1234"
      }
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error("Missing parameter: password"));
  });
});
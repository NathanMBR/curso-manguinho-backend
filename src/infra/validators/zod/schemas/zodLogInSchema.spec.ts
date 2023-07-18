import {
  describe,
  it,
  expect
} from "@jest/globals";
import {
  SafeParseSuccess,
  SafeParseError,
  ZodIssue
} from "zod";

import { zodLogInSchema } from "./zodLogInSchema";

const getCharacters = (quantity: number): string => {
  const lowerCaseAlphabetStartCode = 97;
  const alphabetLength = 26;

  let characters = "";

  for (let i = 0; i < quantity; i++) {
    const randomCharacterCode = Math.floor(Math.random() * alphabetLength) + lowerCaseAlphabetStartCode;
    characters += String.fromCharCode(randomCharacterCode);
  }

  return characters;
};

describe("ZodLogInSchema Test", () => {
  it("should successfully validate a log in payload", () => {
    const SUTRequest = {
      email: "test@email.com",
      password: "test1234"
    };

    type SUTSuccess = SafeParseSuccess<typeof SUTRequest>;

    const SUTResponse = zodLogInSchema.safeParse(SUTRequest) as SUTSuccess;

    expect(SUTResponse.success).toBe(true);
  });

  it("should return an error if email isn't defined", () => {
    const SUTRequest = {
      // email: "test@email.com",
      password: "test1234"
    };

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodLogInSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The log in email is required");
  });

  it("should return an error if email isn't a string", () => {
    const SUTRequest = {
      email: 1,
      password: "test1234"
    };

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodLogInSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The log in email must be a string");
  });

  it("should return an error if email isn't at most 255 characters long", () => {
    const SUTRequest = {
      email: `${getCharacters(255)}@test.com`,
      password: "test1234"
    };

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodLogInSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The log in email must have at most 255 characters");
  });

  it("should return an error if email isn't in a valid format", () => {
    const SUTRequest = {
      email: "invalid-email",
      password: "test1234"
    };

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodLogInSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The log in email must be in a valid format");
  });

  it("should return an error if password isn't defined", () => {
    const SUTRequest = {
      email: "test@email.com",
      // password: "test1234"
    };

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodLogInSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The log in password is required");
  });

  it("should return an error if password isn't a string", () => {
    const SUTRequest = {
      email: "test@email.com",
      password: 1234
    };

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodLogInSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The log in password must be a string");
  });

  it("should return an error if password isn't at least 8 characters long", () => {
    const SUTRequest = {
      email: "test@email.com",
      password: "123456"
    };

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodLogInSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The log in password must have at least 8 characters");
  });

  it("should return an error if payload isn't defined", () => {
    const SUTRequest = undefined;

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodLogInSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The log in payload is required");
  });

  it("should return an error if payload isn't an object", () => {
    const SUTRequest = "invalid-payload";

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodLogInSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The log in payload must be an object");
  });
});
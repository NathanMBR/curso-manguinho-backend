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

import { zodSignUpSchema } from "./zodSignUpSchema";

const getCharacters = (quantity: number): string => {
  const lowerCaseAlphabetStartCode = 97;
  const lettersInAlphabet = 26;

  let characters = "";

  for (let i = 0; i < quantity; i++) {
    const randomCharacterCode = Math.floor(Math.random() * lettersInAlphabet) + lowerCaseAlphabetStartCode;
    characters += String.fromCharCode(randomCharacterCode);
  }

  return characters;
};

describe("ZodSignUpSchema Test", () => {
  it("should successfully validate a sign up payload", () => {
    const SUTRequest = {
      name: "Test name",
      email: "test@email.com",
      password: "test1234"
    };

    type SUTSuccess = SafeParseSuccess<typeof SUTRequest>;

    const SUTResponse = zodSignUpSchema.safeParse(SUTRequest) as SUTSuccess;
    expect(SUTResponse.success).toBe(true);
  });

  it("should return an error if name isn't defined", () => {
    const SUTRequest = {
      // name: "Test name",
      email: "test@email.com",
      password: "test1234"
    };

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodSignUpSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The account name is required");
    
  });

  it("should return an error if name isn't a string", () => {
    const SUTRequest = {
      name: 1,
      email: "test@email.com",
      password: "test1234"
    };

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodSignUpSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The account name must be a string");
  });

  it("should return an error if name isn't at least 3 characters long", () => {
    const SUTRequest = {
      name: "AB",
      email: "test@email.com",
      password: "test1234"
    };

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodSignUpSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The account name must have at least 3 characters");
  });

  it("should return an error if email isn't defined", () => {
    const SUTRequest = {
      name: "Test name",
      // email: "test@email.com",
      password: "test1234"
    };

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodSignUpSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The account email is required");
  });

  it("should return an error if email isn't a string", () => {
    const SUTRequest = {
      name: "Test name",
      email: 1,
      password: "test1234"
    };

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodSignUpSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The account email must be a string");
  });

  it("should return an error if email isn't at most 255 characters long", () => {
    const SUTRequest = {
      name: "Test name",
      email: `${getCharacters(255)}@test.com`,
      password: "test1234"
    };

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodSignUpSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The account email must have at most 255 characters");
  });

  it("should return an error if password isn't defined", () => {
    const SUTRequest = {
      name: "Test name",
      email: "test@email.com",
      // password: "test1234"
    };

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodSignUpSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The account password is required");
  });

  it("should return an error if password isn't a string", () => {
    const SUTRequest = {
      name: "Test name",
      email: "test@email.com",
      password: 1234
    };
  
    type SUTError = SafeParseError<typeof SUTRequest>;
  
    const SUTResponse = zodSignUpSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The account password must be a string");
  });

  it("should return an error if password isn't at least 8 characters long", () => {
    const SUTRequest = {
      name: "Test name",
      email: "test@email.com",
      password: "123456"
    };
  
    type SUTError = SafeParseError<typeof SUTRequest>;
  
    const SUTResponse = zodSignUpSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The account password must have at least 8 characters");
  });

  it("should return an error if payload isn't defined", () => {
    const SUTRequest = undefined;

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodSignUpSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The account payload is required");
  });

  it("should return an error if payload isn't an object", () => {
    const SUTRequest = "not an object";

    type SUTError = SafeParseError<typeof SUTRequest>;

    const SUTResponse = zodSignUpSchema.safeParse(SUTRequest) as SUTError;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The account payload must be an object");
  });
});
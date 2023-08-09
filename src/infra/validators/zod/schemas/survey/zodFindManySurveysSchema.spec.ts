import {
  describe,
  it,
  expect
} from "@jest/globals";
import {
  z as zod,
  SafeParseSuccess,
  SafeParseError,
  ZodIssue
} from "zod";

import { zodFindManySurveysSchema } from "./zodFindManySurveysSchema";

interface GetSUTEnvironmentResponse {
  SUT: typeof zodFindManySurveysSchema;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  return {
    SUT: zodFindManySurveysSchema
  };
};

describe("ZodFindManySurveys Schema", () => {
  it("should successfully validate a find many surveys payload", () => {
    const { SUT } = getSUTEnvironment();

    type SUTSuccess =  SafeParseSuccess<zod.output<typeof SUT>>;

    const SUTRequest = {
      page: 1,
      quantity: 50
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTSuccess;

    expect(SUTResponse.success).toBe(true);
  });

  it("should coerce strings into numbers", () => {
    const { SUT } = getSUTEnvironment();

    type SUTSuccess =  SafeParseSuccess<zod.output<typeof SUT>>;

    const SUTRequest = {
      page: "1",
      quantity: "50"
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTSuccess;

    expect(SUTResponse.success).toBe(true);
  });

  it("should return an error if page isn't defined", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      // page: 1,
      quantity: 50
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The surveys page must be a number");
  });

  it("should return an error if page isn't a number", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      page: NaN,
      quantity: 50
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The surveys page must be a number");
  });

  it("should return an error if page is less than 1", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      page: -3,
      quantity: 50
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The surveys page must be greater than or equal to 1");
  });

  it("should return an error if page isn't an integer number", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      page: 3.1415,
      quantity: 50
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The surveys page must be an integer number");
  });

  it("should return an error if quantity isn't defined", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      page: 1
      // quantity: 50
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The surveys quantity must be a number");
  });

  it("should return an error if quantity isn't a number", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      page: 1,
      quantity: NaN
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The surveys quantity must be a number");
  });

  it("should return an error if quantity is less than 1", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      page: 1,
      quantity: -12
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The surveys quantity must be greater than or equal to 1");
  });

  it("should return an error if quantity is greater than 50", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      page: 1,
      quantity: 78
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The surveys quantity must be less than or equal to 50");
  });

  it("should return an error if quantity isn't an integer number", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      page: 1,
      quantity: 3.1415
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The surveys quantity must be an integer number");
  });

  it("should return an error if payload isn't defined", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = undefined;

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The find many surveys payload is required");
  });

  it("should return an error if payload isn't an object", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = ["test"];

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The find many surveys payload must be an object");
  });
});

import {
  describe,
  it,
  expect
} from "@jest/globals";
import {
  z as zod,
  SafeParseSuccess,
  SafeParseError,
} from "zod";

import { zodFindOneSurveySchema } from "./zodFindOneSurveySchema";

type SUTSuccess = SafeParseSuccess<zod.output<typeof zodFindOneSurveySchema>>;
type SUTFailure = SafeParseError<zod.output<typeof zodFindOneSurveySchema>>;

describe("Zod FindOneSurvey Schema", () => {
  it("should successfully validate a find one survey payload", () => {
    const SUTRequest = {
      id: "5481cc59-4ab7-4d55-be55-9d1a7f6d512f"
    };

    const SUTResponse = zodFindOneSurveySchema.safeParse(SUTRequest) as SUTSuccess;

    expect(SUTResponse.success).toBe(true);
  });

  it("should return an error if id isn't defined", () => {
    const SUTRequest = {
      // id: "5481cc59-4ab7-4d55-be55-9d1a7f6d512f"
    };

    const SUTResponse = zodFindOneSurveySchema.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0]!;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey ID is required");
  });

  it("should return an error if id isn't a string", () => {
    const SUTRequest = {
      id: 1
    };

    const SUTResponse = zodFindOneSurveySchema.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0]!;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey ID must be a string");
  });

  it("should return an error if id isn't a valid UUID", () => {
    const SUTRequest = {
      id: "test-id"
    };

    const SUTResponse = zodFindOneSurveySchema.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0]!;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey ID must be a valid UUID");
  });

  it("should return an error if payload isn't defined", () => {
    const SUTRequest = undefined;

    const SUTResponse = zodFindOneSurveySchema.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0]!;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The find one survey payload is required");
  });

  it("should return an error if payload isn't an object", () => {
    const SUTRequest = "test";

    const SUTResponse = zodFindOneSurveySchema.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0]!;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The find one survey payload must be an object");
  });
});

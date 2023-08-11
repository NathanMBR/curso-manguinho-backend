import {
  describe,
  it,
  expect
} from "@jest/globals";
import {
  z as zod,
  SafeParseSuccess,
  SafeParseError
} from "zod";

import { zodAddUserAnswerSchema } from "./zodAddUserAnswerSchema";

type SUTSuccess = SafeParseSuccess<zod.output<typeof zodAddUserAnswerSchema>>;
type SUTFailure = SafeParseError<zod.output<typeof zodAddUserAnswerSchema>>;

describe("Zod AddUserAnswer Schema", () => {
  it("should successfully validate a add user answer schema", () => {
    const SUTRequest = [
      {
        questionId: "5481cc59-4ab7-4d55-be55-9d1a7f6d512f",
        answerId: "5481cc59-4ab7-4d55-be55-9d1a7f6d512f"
      }
    ];

    const SUTResponse = zodAddUserAnswerSchema.safeParse(SUTRequest) as SUTSuccess;

    expect(SUTResponse.success).toBe(true);
  });

  it("should return an error if question id isn't defined", () => {
    const SUTRequest = [
      {
        // questionId: "5481cc59-4ab7-4d55-be55-9d1a7f6d512f",
        answerId: "5481cc59-4ab7-4d55-be55-9d1a7f6d512f"
      }
    ];

    const SUTResponse = zodAddUserAnswerSchema.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0]!;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The user answer question ID is required");
  });

  it("should return an error if question id isn't a string", () => {
    const SUTRequest = [
      {
        questionId: 1,
        answerId: "5481cc59-4ab7-4d55-be55-9d1a7f6d512f"
      }
    ];

    const SUTResponse = zodAddUserAnswerSchema.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0]!;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The user answer question ID must be a string");
  });

  it("should return an error if question id isn't a valid UUID", () => {
    const SUTRequest = [
      {
        questionId: "question-id",
        answerId: "5481cc59-4ab7-4d55-be55-9d1a7f6d512f"
      }
    ];

    const SUTResponse = zodAddUserAnswerSchema.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0]!;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The user answer question ID must be a valid UUID");
  });

  it("should return an error if answer id isn't defined", () => {
    const SUTRequest = [
      {
        questionId: "5481cc59-4ab7-4d55-be55-9d1a7f6d512f"
        // answerId: "5481cc59-4ab7-4d55-be55-9d1a7f6d512f"
      }
    ];

    const SUTResponse = zodAddUserAnswerSchema.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0]!;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The user answer \"answer ID\" is required");
  });

  it("should return an error if answer id isn't a string", () => {
    const SUTRequest = [
      {
        questionId: "5481cc59-4ab7-4d55-be55-9d1a7f6d512f",
        answerId: 1
      }
    ];

    const SUTResponse = zodAddUserAnswerSchema.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0]!;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The user answer \"answer ID\" must be a string");
  });

  it("should return an error if answer id isn't a valid UUID", () => {
    const SUTRequest = [
      {
        questionId: "5481cc59-4ab7-4d55-be55-9d1a7f6d512f",
        answerId: "answer-id"
      }
    ];

    const SUTResponse = zodAddUserAnswerSchema.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0]!;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The user answer \"answer ID\" must be a valid UUID");
  });

  it("should return an error if add user answer payload isn't defined", () => {
    const SUTRequest = [
      undefined
    ];

    const SUTResponse = zodAddUserAnswerSchema.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0]!;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The add user answer payload is required");
  });

  it("should return an error if add user answer payload isn't an object", () => {
    const SUTRequest = [
      "invalid payload"
    ];

    const SUTResponse = zodAddUserAnswerSchema.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0]!;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The add user answer payload must be an object");
  });

  it("should return an error if add user answer payload list isn't defined", () => {
    const SUTRequest = undefined;

    const SUTResponse = zodAddUserAnswerSchema.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0]!;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The add user answers list is required");
  });

  it("should return an error if add user answer payload list isn't an array", () => {
    const SUTRequest = "invalid list";

    const SUTResponse = zodAddUserAnswerSchema.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0]!;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The add user answers list must be an array");
  });
});

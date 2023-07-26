import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";
import { ZodError } from "zod";

import { zodAddSurveySchema } from "../../schemas";
import { ZodAddSurveyValidator } from "./ZodAddSurveyValidator";

interface GetSUTEnvironmentResponse {
  SUT: ZodAddSurveyValidator;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  const addSurveyValidator = new ZodAddSurveyValidator();

  return {
    SUT: addSurveyValidator
  };
};

const globalDate = new Date();

jest.spyOn(zodAddSurveySchema, "safeParse").mockReturnValue(
  {
    success: true,
    data: {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: globalDate,
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body"
            }
          ]
        }
      ]
    }
  }
);

describe("Zod AddSurvey Validator", () => {
  it("should successfully validate add survey payload", () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: globalDate,
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body"
            }
          ]
        }
      ]
    };

    const SUTResponse = SUT.validate(SUTRequest);

    const expectedResponse = {
      isValid: true,
      errors: [],
      data: {
        title: "Test Survey Title",
        description: "test survey description",
        expiresAt: globalDate,
        questions: [
          {
            title: "Test Question Title",
            description: "test question description",
            type: "SINGLE",
            answers: [
              {
                body: "test answer body"
              }
            ]
          }
        ]
      }
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should return error response if zod validator returns error", () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(zodAddSurveySchema, "safeParse").mockReturnValueOnce(
      {
        success: false,
        error: new ZodError(
          [
            {
              code: "custom",
              path: ["test"],
              message: "Test error"
            }
          ]
        )
      }
    );

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: globalDate,
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body"
            }
          ]
        }
      ]
    };

    const SUTResponse = SUT.validate(SUTRequest);
    const expectedResponse = {
      isValid: false,
      errors: [
        "Test error"
      ]
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should pass add survey payload to zod validator", () => {
    const { SUT } = getSUTEnvironment();
    const safeParseSpy = jest.spyOn(zodAddSurveySchema, "safeParse");

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: globalDate,
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body"
            }
          ]
        }
      ]
    };

    SUT.validate(SUTRequest);

    expect(safeParseSpy).toHaveBeenCalledWith(SUTRequest);
  });

  it("should not use error throwing zod method", () => {
    const { SUT } = getSUTEnvironment();
    const parseSpy = jest.spyOn(zodAddSurveySchema, "parse");

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: globalDate,
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body"
            }
          ]
        }
      ]
    };

    SUT.validate(SUTRequest);

    expect(parseSpy).not.toHaveBeenCalled();
  });

  it("should repass zod errors to upper level", () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(zodAddSurveySchema, "safeParse").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: globalDate,
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body"
            }
          ]
        }
      ]
    };

    const getSUTResponse = () => SUT.validate(SUTRequest);

    expect(getSUTResponse).toThrow();
  });
});
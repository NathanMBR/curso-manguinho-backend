import {
  describe,
  it,
  expect
} from "@jest/globals";

import { adaptValidatorResponse } from "./adaptValidatorResponse";

type SUTSuccessfulResponse<T> = {
  isValid: true;
  data: T
};

type SUTFailureResponse = {
  isValid: false;
  errorMessage: string;
};

describe("ValidatorResponse Adapter", () => {
  it("should successfully adapt a validator response", () => {
    const data = {
      test: "Test data"
    };

    const SUTResponse = adaptValidatorResponse(
      {
        isValid: true,
        errors: [],
        data
      }
    ) as SUTSuccessfulResponse<typeof data>;

    expect(SUTResponse.isValid).toBe(true);
  });

  it("should return failure response if not valid", () => {
    const SUTResponse = adaptValidatorResponse(
      {
        isValid: false,
        errors: [
          "Test error"
        ]
      }
    ) as SUTFailureResponse;

    expect(SUTResponse.isValid).toBe(false);
  });

  it("should return the first error of the errors list if not valid", () => {
    const SUTResponse = adaptValidatorResponse(
      {
        isValid: false,
        errors: [
          "Test error 1",
          "Test error 2",
          "Test error 3"
        ]
      }
    ) as SUTFailureResponse;

    expect(SUTResponse.errorMessage).toBe("Test error 1");
  });

  it("should throw error if valid and contains error message", () => {
    const getSUTResponse = () => adaptValidatorResponse(
      {
        isValid: true,
        errors: [
          "Test error"
        ],
        data: "Test data"
      }
    );

    expect(getSUTResponse).toThrowError(new Error("Unexpected error message to adapt"));
  });

  it("should throw error if valid and missing data", () => {
    const getSUTResponse = () => adaptValidatorResponse(
      {
        isValid: true,
        errors: []
      }
    );

    expect(getSUTResponse).toThrowError(new Error("Missing validated data"));
  });

  it("should throw error if not valid and missing error message", () => {
    const getSUTResponse = () => adaptValidatorResponse(
      {
        isValid: false,
        errors: []
      }
    );

    expect(getSUTResponse).toThrowError(new Error("Missing error message to adapt"));
  });

  it("should throw error if not valid and contains data", () => {
    const getSUTResponse = () => adaptValidatorResponse(
      {
        isValid: false,
        errors: [
          "Test error"
        ],
        data: "Test data"
      }
    );

    expect(getSUTResponse).toThrowError(new Error("Unexpected data with failed validation"));
  });
});
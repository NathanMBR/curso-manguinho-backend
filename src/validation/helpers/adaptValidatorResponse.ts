import { Validator } from "../../presentation/protocols";
import { ValidationResponse } from "../models";

export const adaptValidatorResponse = (validationResponse: ValidationResponse): Validator.Response => {
  const { isValid } = validationResponse;
  const [errorMessage] = validationResponse.errors;

  if (isValid) {
    if (errorMessage)
      throw new Error("Unexpected error message to adapt");

    return {
      isValid
    };
  }

  if (!errorMessage)
    throw new Error("Missing error message to adapt");

  return {
    isValid,
    errorMessage
  };
};
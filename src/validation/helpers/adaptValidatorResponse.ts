import { Validator } from "../../presentation/protocols";
import { ValidationResponse } from "../models";

export const adaptValidatorResponse = <T>(validationResponse: ValidationResponse<T>): Validator.Response<T> => {
  const { isValid, data } = validationResponse;
  const [errorMessage] = validationResponse.errors;

  if (isValid) {
    if (errorMessage)
      throw new Error("Unexpected error message to adapt");

    if (!data)
      throw new Error("Missing validated data");

    return {
      isValid,
      data
    };
  }

  if (!errorMessage)
    throw new Error("Missing error message to adapt");

  if (data)
    throw new Error("Unexpected data with failed validation");

  return {
    isValid,
    errorMessage
  };
};
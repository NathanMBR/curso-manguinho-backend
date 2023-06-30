import { SafeParseReturnType } from "zod";

import { Validator } from "../../../presentation/protocols";

export const zodValidationAdapter = <T, K>(zodValidationResponse: SafeParseReturnType<T, K>): Validator.Response => {
  const { success } = zodValidationResponse;

  const adaptedResponse: Validator.Response = {
    isValid: success,
    errors: []
  };

  if (!success)
    adaptedResponse.errors = zodValidationResponse.error.issues.map(issue => issue.message);

  return adaptedResponse;
};
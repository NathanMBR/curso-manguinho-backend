import { SafeParseReturnType } from "zod";

import { ValidationResponse } from "../../../../validation/models";

export const zodValidationAdapter = <T, K>(zodValidationResponse: SafeParseReturnType<T, K>): ValidationResponse => {
  const { success } = zodValidationResponse;

  const adaptedResponse: ValidationResponse = {
    isValid: success,
    errors: []
  };

  if (!success)
    adaptedResponse.errors = zodValidationResponse.error.issues.map(issue => issue.message);

  return adaptedResponse;
};
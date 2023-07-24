import { SafeParseReturnType, z } from "zod";

import { ValidationResponse } from "../../../../validation/models";

export const zodValidationAdapter = <T, K>(zodValidationResponse: SafeParseReturnType<T, K>) => {
  const { success } = zodValidationResponse;

  const adaptedResponse: ValidationResponse<K> = {
    isValid: success,
    errors: []
  };

  if (!success)
    adaptedResponse.errors = zodValidationResponse.error.issues.map(issue => issue.message);
  else
    adaptedResponse.data = zodValidationResponse.data;

  return adaptedResponse;
};
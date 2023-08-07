import { Validator } from "../../../presentation/protocols";
import { FindManySurveysRequest } from "../../../presentation/models";
import { FindManySurveysValidator } from "../../protocols";
import { adaptValidatorResponse } from "../../helpers";

export class FindManySurveysValidatorAdapter implements Validator.Protocol<FindManySurveysRequest> {
  constructor(
    private readonly findManySurveysValidator: FindManySurveysValidator.Protocol
  ) {}

  validate(data: Validator.Request): Validator.Response<FindManySurveysRequest> {
    const defaultResponse = {
      isValid: true as const,
      data: {
        page: 1,
        quantity: 50
      }
    };

    const surveyValidation = this.findManySurveysValidator.validate(data);

    if (!surveyValidation.isValid)
      return defaultResponse;

    return adaptValidatorResponse(surveyValidation);
  }
}
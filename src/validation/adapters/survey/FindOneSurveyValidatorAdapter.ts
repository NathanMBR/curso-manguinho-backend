import { Validator } from "../../../presentation/protocols";
import { FindOneSurveyRequest } from "../../../presentation/models";
import { FindOneSurveyValidator } from "../../protocols";
import { adaptValidatorResponse } from "../../helpers";

export class FindOneSurveyValidatorAdapter implements Validator.Protocol<FindOneSurveyRequest> {
  constructor(
    private readonly findOneSurveyValidator: FindOneSurveyValidator.Protocol
  ) {}

  validate(data: Validator.Request): Validator.Response<FindOneSurveyRequest> {
    const surveyValidation = this.findOneSurveyValidator.validate(data);

    return adaptValidatorResponse(surveyValidation);
  }
}

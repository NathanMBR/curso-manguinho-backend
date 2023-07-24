import { Validator } from "../../../presentation/protocols";
import { AddSurveyRequest } from "../../../presentation/models";
import { AddSurveyValidator } from "../../protocols";
import { adaptValidatorResponse } from "../../helpers";

export class AddSurveyValidatorAdapter implements Validator.Protocol<AddSurveyRequest> {
  constructor(
    private readonly addSurveyValidator: AddSurveyValidator.Protocol
  ) {}

  validate(data: Validator.Request): Validator.Response<AddSurveyRequest> {
    const surveyValidation = this.addSurveyValidator.validate(data);

    return adaptValidatorResponse(surveyValidation);
  }
}
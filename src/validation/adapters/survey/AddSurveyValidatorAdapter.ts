import { Validator } from "../../../presentation/protocols";
import { AddSurveyValidator } from "../../protocols";
import { adaptValidatorResponse } from "../../helpers";

export class AddSurveyValidatorAdapter implements Validator.Protocol {
  constructor(
    private readonly addSurveyValidator: AddSurveyValidator.Protocol
  ) {}

  validate(data: Validator.Request): Validator.Response {
    const surveyValidation = this.addSurveyValidator.validate(data);

    return adaptValidatorResponse(surveyValidation);
  }
}
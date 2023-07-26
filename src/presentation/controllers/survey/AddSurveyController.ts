import {
  Controller,
  Validator
} from "../../protocols";
import {
  ValidationError,
  RequiredAuthenticationError
} from "../../errors";
import { AddSurveyRequest } from "../../models";
import { AddSurvey } from "../../../domain/usecases";
import { HttpResponseHelper } from "../../helpers";

export class AddSurveyController implements Controller.Protocol {
  constructor(
    private readonly addSurveyValidator: Validator.Protocol<AddSurveyRequest>,
    private readonly addSurvey: AddSurvey.Protocol
  ) {}

  async handle(httpRequest: Controller.Request): Controller.Response {
    const {
      authenticationData,
      body
    } = httpRequest;

    if (!authenticationData)
      return HttpResponseHelper.unauthorized(
        new RequiredAuthenticationError()
      );

    const bodyValidation = this.addSurveyValidator.validate(body);

    if (!bodyValidation.isValid)
      return HttpResponseHelper.badRequest(
        new ValidationError(bodyValidation.errorMessage)
      );

    const survey = await this.addSurvey.add(
      {
        ...bodyValidation.data,
        accountId: authenticationData.id
      }
    );

    return HttpResponseHelper.created(
      survey
    );
  }
}
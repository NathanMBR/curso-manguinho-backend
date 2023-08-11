import {
  Controller,
  Validator
} from "../../protocols";
import {
  RequiredAuthenticationError,
  ValidationError,
  NotFoundError
} from "../../errors";
import { FindOneSurveyRequest } from "../../models";
import { FindOneSurvey } from "../../../domain/usecases";
import { HttpResponseHelper } from "../../helpers";

export class FindOneSurveyController implements Controller.Protocol {
  constructor(
    private readonly findOneSurveyValidator: Validator.Protocol<FindOneSurveyRequest>,
    private readonly findOneSurvey: FindOneSurvey.Protocol
  ) {}

  async handle(httpRequest: Controller.Request): Controller.Response {
    const {
      authenticationData,
      params
    } = httpRequest;

    if (!authenticationData)
      return HttpResponseHelper.unauthorized(
        new RequiredAuthenticationError()
      );

    const paramsValidation = this.findOneSurveyValidator.validate(params);

    if (!paramsValidation.isValid)
      return HttpResponseHelper.badRequest(
        new ValidationError(paramsValidation.errorMessage)
      );

    const survey = await this.findOneSurvey.findOne(paramsValidation.data);

    if (!survey)
      return HttpResponseHelper.notFound(
        new NotFoundError(`Survey with ID "${paramsValidation.data.id}" not found`)
      );

    return HttpResponseHelper.ok(survey);
  }
}

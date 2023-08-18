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
import { GetSurveyResult } from "../../../domain/usecases";
import { HttpResponseHelper } from "../../helpers";

export class GetSurveyResultController implements Controller.Protocol {
  constructor(
    private readonly getSurveyResultValidator: Validator.Protocol<FindOneSurveyRequest>,
    private readonly getSurveyResult: GetSurveyResult.Protocol
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

    const paramsValidation = this.getSurveyResultValidator.validate(params);

    if (!paramsValidation.isValid)
      return HttpResponseHelper.badRequest(
        new ValidationError(paramsValidation.errorMessage)
      );

    const surveyResult = await this.getSurveyResult.get(
      {
        surveyId: paramsValidation.data.id,
      }
    );

    if (!surveyResult)
      return HttpResponseHelper.notFound(
        new NotFoundError(`Survey with ID "${paramsValidation.data.id}" not found`)
      );

    return HttpResponseHelper.ok(surveyResult);
  }
}

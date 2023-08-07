import {
  Controller,
  Validator
} from "../../protocols";
import {
  RequiredAuthenticationError,
  InternalServerError
} from "../../errors";
import { FindManySurveysRequest } from "../../models";
import { FindManySurveys } from "../../../domain/usecases";
import { HttpResponseHelper } from "../../helpers";

export class FindManySurveysController implements Controller.Protocol {
  constructor(
    private readonly findManySurveysValidator: Validator.Protocol<FindManySurveysRequest>,
    private readonly findManySurveys: FindManySurveys.Protocol
  ) {}

  async handle(httpRequest: Controller.Request): Controller.Response {
    const {
      authenticationData,
      query
    } = httpRequest;

    if (!authenticationData)
      return HttpResponseHelper.unauthorized(
        new RequiredAuthenticationError()
      );

    const queryValidation = this.findManySurveysValidator.validate(query);

    if (!queryValidation.isValid)
      return HttpResponseHelper.internalServerError(
        new InternalServerError()
      );

    const surveys = await this.findManySurveys.findMany(queryValidation.data);

    return HttpResponseHelper.ok(surveys);
  }
}
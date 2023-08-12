import {
  Controller,
  Validator
} from "../../protocols";
import {
  RequiredAuthenticationError,
  ValidationError,
  NotFoundError
} from "../../errors";
import {
  FindOneSurveyRequest,
  AddUserAnswerRequest
} from "../../models";
import {
  FindOneSurvey,
  AddUserAnswer
} from "../../../domain/usecases";
import { HttpResponseHelper } from "../../helpers";

export class AddSurveyAnswerController implements Controller.Protocol {
  constructor(
    private readonly findOneSurveyValidator: Validator.Protocol<FindOneSurveyRequest>,
    private readonly addUserAnswerValidator: Validator.Protocol<AddUserAnswerRequest>,
    private readonly findOneSurvey: FindOneSurvey.Protocol,
    private readonly addUserAnswer: AddUserAnswer.Protocol
  ) {}

  async handle(httpRequest: Controller.Request): Controller.Response {
    const {
      authenticationData,
      params,
      body
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

    const bodyValidation = this.addUserAnswerValidator.validate(body);

    if (!bodyValidation.isValid)
      return HttpResponseHelper.badRequest(
        new ValidationError(bodyValidation.errorMessage)
      );

    const survey = await this.findOneSurvey.findOne(
      {
        id: paramsValidation.data.id
      }
    );

    if (!survey)
      return HttpResponseHelper.notFound(
        new NotFoundError(`Survey with ID "${paramsValidation.data.id}" not found`)
      );

    const addUserAnswerResponse = await this.addUserAnswer.add(
      {
        survey,
        accountId: authenticationData.id,
        userAnswers: bodyValidation.data
      }
    );

    if (!addUserAnswerResponse.success)
      return HttpResponseHelper.badRequest(
        new ValidationError(addUserAnswerResponse.errorMessage)
      );

    return HttpResponseHelper.noContent();
  }
}

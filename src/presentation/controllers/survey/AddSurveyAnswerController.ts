import {
  Controller,
  Validator
} from "../../protocols";
import {
  RequiredAuthenticationError,
  ValidationError,
  NotFoundError,
  SurveyAlreadyAnsweredError,
  ExpiredContentError
} from "../../errors";
import {
  FindOneSurveyRequest,
  AddUserAnswerRequest
} from "../../models";
import {
  FindOneSurvey,
  FindOneUserAnsweredSurvey,
  AddUserAnswer
} from "../../../domain/usecases";
import { HttpResponseHelper } from "../../helpers";

export class AddSurveyAnswerController implements Controller.Protocol {
  constructor(
    private readonly findOneSurveyValidator: Validator.Protocol<FindOneSurveyRequest>,
    private readonly addUserAnswerValidator: Validator.Protocol<AddUserAnswerRequest>,
    private readonly findOneSurvey: FindOneSurvey.Protocol,
    private readonly findOneUserAnsweredSurvey: FindOneUserAnsweredSurvey.Protocol,
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

    const isSurveyAlreadyAnswered = await this.findOneUserAnsweredSurvey.findOne(
      {
        accountId: authenticationData.id,
        surveyId: paramsValidation.data.id
      }
    );

    if (isSurveyAlreadyAnswered)
      return HttpResponseHelper.forbidden(
        new SurveyAlreadyAnsweredError(paramsValidation.data.id)
      );

    const addUserAnswerResponse = await this.addUserAnswer.add(
      {
        survey,
        accountId: authenticationData.id,
        userAnswers: bodyValidation.data
      }
    );

    const addUserAnswerFailureResponsesMapper: Record<
      AddUserAnswer.FailureResponseErrorTypes,
      (message: string) => Awaited<Controller.Response>
    > = {
      EXPIRED_SURVEY: message => HttpResponseHelper.forbidden(
        new ExpiredContentError(message)
      ),

      INVALID_PAYLOAD: message => HttpResponseHelper.badRequest(
        new ValidationError(message)
      )
    };

    if (!addUserAnswerResponse.success) {
      const errorType = addUserAnswerResponse.error.type;
      const getFailureResponse = addUserAnswerFailureResponsesMapper[errorType];

      return getFailureResponse(addUserAnswerResponse.error.message);
    }

    return HttpResponseHelper.noContent();
  }
}

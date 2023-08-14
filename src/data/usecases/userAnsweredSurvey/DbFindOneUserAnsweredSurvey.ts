import { FindOneUserAnsweredSurvey } from "../../../domain/usecases";
import { FindOneUserAnsweredSurveyRepository } from "../../protocols";


export class DbFindOneUserAnsweredSurvey implements FindOneUserAnsweredSurvey.Protocol {
  constructor(
    private readonly findOneUserAnsweredSurveyRepository: FindOneUserAnsweredSurveyRepository.Protocol
  ) {}

  async findOne(request: FindOneUserAnsweredSurvey.Request): FindOneUserAnsweredSurvey.Response {
    const {
      accountId,
      surveyId
    } = request;

    const userAnsweredSurvey = await this.findOneUserAnsweredSurveyRepository.findOne(
      {
        accountId,
        surveyId
      }
    );

    return userAnsweredSurvey;
  }
}

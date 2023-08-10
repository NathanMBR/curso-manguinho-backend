import { FindOneSurvey } from "../../../domain/usecases";
import { FindOneSurveyRepository } from "../../protocols";

export class DbFindOneSurvey implements FindOneSurvey.Protocol {
  constructor(
    private readonly findOneSurveyRepository: FindOneSurveyRepository.Protocol
  ) {}

  async findOne(request: FindOneSurvey.Request): FindOneSurvey.Response {
    const survey = await this.findOneSurveyRepository.findOne(request);

    return survey;
  }
}

import { AddSurvey } from "../../../domain/usecases";
import { AddSurveyRepository } from "../../protocols";

export class DbAddSurvey implements AddSurvey.Protocol {
  constructor(
    private readonly addSurveyRepository: AddSurveyRepository.Protocol
  ) {}

  async add(request: AddSurvey.Request): AddSurvey.Response {
    const survey = await this.addSurveyRepository.add(request);

    return survey;
  }
}
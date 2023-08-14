import { RepositoryUserAnsweredSurvey } from "../../../models";

export namespace FindOneUserAnsweredSurveyRepository {
  export type Request = {
    accountId: RepositoryUserAnsweredSurvey["accountId"];
    surveyId: RepositoryUserAnsweredSurvey["surveyId"];
  }

  export type Response = Promise<RepositoryUserAnsweredSurvey | null>;

  export interface Protocol {
    findOne(request: FindOneUserAnsweredSurveyRepository.Request): FindOneUserAnsweredSurveyRepository.Response;
  }
}

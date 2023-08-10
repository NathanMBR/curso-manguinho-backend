import { RepositorySurvey } from "../../../models";

export namespace FindOneSurveyRepository {
  export type Request = {
    id: RepositorySurvey["id"];
  }

  export type Response = Promise<RepositorySurvey | null>;

  export interface Protocol {
    findOne(request: FindOneSurveyRepository.Request): FindOneSurveyRepository.Response;
  }
}

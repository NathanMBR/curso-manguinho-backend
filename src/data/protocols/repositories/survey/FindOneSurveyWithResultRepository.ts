import { RepositorySurveyWithResult } from "../../../models";

export namespace FindOneSurveyWithResultRepository {
  export type Request = {
    id: RepositorySurveyWithResult["id"];
  };

  export type Response = Promise<RepositorySurveyWithResult | null>;

  export interface Protocol {
    findOneWithResult(request: FindOneSurveyWithResultRepository.Request): FindOneSurveyWithResultRepository.Response;
  }
}

import {
  RepositoryPagination,
  RepositorySurvey
} from "../../../models";

export namespace FindManySurveysRepository {
  export type Request = RepositoryPagination;

  type ResponseSurvey = Omit<RepositorySurvey, "questions">;

  export type Response = Promise<Array<ResponseSurvey>>;

  export interface Protocol {
    findMany(request: FindManySurveysRepository.Request): FindManySurveysRepository.Response;
  }
}
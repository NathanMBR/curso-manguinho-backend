import {
  Pagination,
  Survey
} from "../../models";

export namespace FindManySurveys {
  export type Request = Pagination.Request;

  type ResponseSurvey = Omit<Survey, "questions">;

  export type Response = Promise<Pagination.Response<ResponseSurvey>>;

  export interface Protocol {
    findMany(request: FindManySurveys.Request): FindManySurveys.Response;
  }
}
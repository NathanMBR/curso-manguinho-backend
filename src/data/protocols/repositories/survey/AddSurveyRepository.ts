import {
  RepositoryAnswer,
  RepositoryQuestion,
  RepositorySurvey
} from "../../../models";

export namespace AddSurveyRepository {
  type RequestRepositoryAnswer = Omit<RepositoryAnswer, "id">;

  type RequestRepositoryQuestion = Omit<RepositoryQuestion, "id" | "answers"> & {
    answers: Array<RequestRepositoryAnswer>
  };

  type RequestRepositorySurvey = Omit<RequestRepositoryQuestion, "id" | "questions"> & {
    questions: Array<RequestRepositoryQuestion>
  };

  export type Request = RequestRepositorySurvey;

  export type Response = Promise<RepositorySurvey>;

  export interface Protocol {
    add(request: AddSurveyRepository.Request): AddSurveyRepository.Response;
  }
}
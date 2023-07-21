import {
  Survey,
  Question,
  Answer
} from "../models";

export namespace AddSurvey {
  type RequestAnswer = Omit<Answer, "id">;

  type RequestQuestion = Omit<Question, "id" | "answers"> & {
    answers: Array<RequestAnswer>
  }

  type RequestSurvey = Omit<Survey, "id" | "questions"> & {
    questions: Array<RequestQuestion>
  }

  export type Request = RequestSurvey;

  export type Response = Promise<Survey>;

  export interface Protocol {
    add(request: AddSurvey.Request): AddSurvey.Response;
  }
}
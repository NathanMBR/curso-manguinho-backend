import { Answer } from "./Answer";

export type QuestionType = "SINGLE" | "MULTIPLE";

export interface Question {
  id: string;
  title: string;
  description: string | null;
  type: QuestionType;
  surveyId: string;
  answers: Array<Answer>;
}
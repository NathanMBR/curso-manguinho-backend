import { RepositoryAnswer } from "./RepositoryAnswer";

export type RepositoryQuestionType = "SINGLE" | "MULTIPLE";

export interface RepositoryQuestion {
  id: string;
  title: string;
  description: string | null;
  type: RepositoryQuestionType;
  surveyId: string;
  answers: Array<RepositoryAnswer>;
}
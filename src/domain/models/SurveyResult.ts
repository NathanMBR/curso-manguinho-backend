import { Survey } from "./Survey";
import { Question } from "./Question";
import { Answer } from "./Answer";

export interface SurveyResult {
  survey: Pick<Survey, "id" | "title">;
  timesAnswered: number;
  questions: Array<
    {
      question: Pick<Question, "id" | "title" | "type">;
      answers: Array<
        {
          answer: Pick<Answer, "id" | "body">;
          percentage: number;
        }
      >;
    }
  >;
}

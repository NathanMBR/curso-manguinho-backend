import { RepositoryAnswer } from "./RepositoryAnswer";
import { RepositoryUserAnswer } from "./RepositoryUserAnswer";
import { RepositoryQuestion } from "./RepositoryQuestion";
import { RepositorySurvey } from "./RepositorySurvey";
import { RepositoryUserAnsweredSurvey } from "./RepositoryUserAnsweredSurvey";

interface RepositoryAnswerWithResult extends RepositoryAnswer {
  userAnswers: Array<RepositoryUserAnswer>;
}

interface RepositoryQuestionWithResult extends RepositoryQuestion {
  answers: Array<RepositoryAnswerWithResult>;
}

export interface RepositorySurveyWithResult extends RepositorySurvey {
  questions: Array<RepositoryQuestionWithResult>;
  userAnsweredSurveys: Array<Pick<RepositoryUserAnsweredSurvey, "id">>;
}

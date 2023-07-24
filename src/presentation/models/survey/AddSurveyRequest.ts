interface AddSurveyRequestAnswer {
  body: string;
}

type AddSurveyRequestQuestionType = "SINGLE" | "MULTIPLE";

interface AddSurveyRequestQuestion {
  title: string;
  description: string | null;
  type: AddSurveyRequestQuestionType;
  answers: Array<AddSurveyRequestAnswer>;
}

export interface AddSurveyRequest {
  title: string;
  description: string | null;
  expiresAt: Date | null;
  questions: Array<AddSurveyRequestQuestion>
}
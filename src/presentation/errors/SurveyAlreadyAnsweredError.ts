export class SurveyAlreadyAnsweredError extends Error {
  constructor(surveyId: string) {
    super(`Survey with ID ${surveyId} already answered`);
    this.name = "SurveyAlreadyAnsweredError";
  }
}

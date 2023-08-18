import { GetSurveyResult } from "../../../domain/usecases";
import { FindOneSurveyWithResultRepository } from "../../protocols";

export class DbGetSurveyResult implements GetSurveyResult.Protocol {
  constructor(
    private readonly findOneSurveyWithResultRepository: FindOneSurveyWithResultRepository.Protocol
  ) {}

  async get(request: GetSurveyResult.Request): GetSurveyResult.Response {
    const { surveyId } = request;

    const surveyWithResult = await this.findOneSurveyWithResultRepository.findOneWithResult(
      {
        id: surveyId
      }
    );

    if (!surveyWithResult)
      return null;

    const userAnsweredSurveysCount = surveyWithResult.userAnsweredSurveys.length;

    const surveyResult: Awaited<GetSurveyResult.Response> = {
      survey: {
        id: surveyWithResult.id,
        title: surveyWithResult.title
      },
      timesAnswered: userAnsweredSurveysCount,
      questions: surveyWithResult.questions.map(
        question => {
          return {
            question: {
              id: question.id,
              title: question.title,
              type: question.type
            },
            answers: question.answers.map(
              answer => {
                const timesChosenAnswer = answer.userAnswers.length;

                const percentChosenAnswer = (timesChosenAnswer / userAnsweredSurveysCount) * 100 || 0;

                return {
                  answer: {
                    id: answer.id,
                    body: answer.body
                  },
                  percentage: percentChosenAnswer
                };
              }
            )
          };
        }
      )
    };

    return surveyResult;
  }
}

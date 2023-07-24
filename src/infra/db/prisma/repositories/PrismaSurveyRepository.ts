import { AddSurveyRepository } from "../../../../data/protocols";
import { prisma } from "../prisma";

export class PrismaSurveyRepository implements AddSurveyRepository.Protocol {
  async add(request: AddSurveyRepository.Request): AddSurveyRepository.Response {
    const {
      title,
      description,
      expiresAt,
      questions
    } = request;

    const survey = await prisma.$transaction(
      async transaction => {
        const surveyId = await transaction.survey.create(
          {
            data: {
              title,
              description,
              expiresAt
            },

            select: {
              id: true
            }
          }
        );

        await Promise.all(
          questions.map(
            ({ answers, ...question }) => transaction.question.create(
              {
                data: {
                  ...question,
                  survey: {
                    connect: {
                      id: surveyId.id
                    }
                  },
                  answers: {
                    createMany: {
                      data: answers
                    }
                  }
                },

                select: {
                  id: true
                }
              }
            )
          )
        );

        const surveyWithQuestionsAndAnswers = await transaction.survey.findUnique(
          {
            where: {
              id: surveyId.id
            },

            include: {
              questions: {
                include: {
                  answers: true
                }
              }
            }
          }
        );

        if (!surveyWithQuestionsAndAnswers)
          throw new Error("Unexpected missing survey");

        return surveyWithQuestionsAndAnswers;
      }
    );

    return survey;
  }
}
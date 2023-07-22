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
        const questionsIds = await Promise.all(
          questions.map(
            ({ answers, ...question }) => transaction.question.create(
              {
                data: {
                  ...question,
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

        const createdSurvey = await transaction.survey.create(
          {
            data: {
              title,
              description,
              expiresAt,
              questions: {
                connect: questionsIds
              }
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

        return createdSurvey;
      }
    );

    return survey;
  }
}
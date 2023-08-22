import { PrismaClient } from "@prisma/client";

import {
  AddSurveyRepository,
  FindManySurveysRepository,
  CountManySurveysRepository,
  FindOneSurveyRepository,
  FindOneSurveyWithResultRepository
} from "../../../data/protocols";

export class PrismaSurveyRepository implements
  AddSurveyRepository.Protocol,
  FindManySurveysRepository.Protocol,
  CountManySurveysRepository.Protocol,
  FindOneSurveyRepository.Protocol,
  FindOneSurveyWithResultRepository.Protocol
{
  constructor(
    private readonly prisma: PrismaClient
  ) {}

  async add(request: AddSurveyRepository.Request): AddSurveyRepository.Response {
    const {
      title,
      description,
      expiresAt,
      questions,
      accountId
    } = request;

    const survey = await this.prisma.$transaction(
      async transaction => {
        const surveyId = await transaction.survey.create(
          {
            data: {
              title,
              description,
              expiresAt,
              accountId
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

  async findMany(request: FindManySurveysRepository.Request): FindManySurveysRepository.Response {
    const {
      skip,
      take
    } = request;

    const surveys = await this.prisma.survey.findMany(
      {
        skip,
        take
      }
    );

    return surveys;
  }

  async countMany(): CountManySurveysRepository.Response {
    const count = await this.prisma.survey.count();

    return count;
  }

  async findOne(request: FindOneSurveyRepository.Request): FindOneSurveyRepository.Response {
    const {
      id
    } = request;

    const survey = await this.prisma.survey.findUnique(
      {
        where: {
          id
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

    return survey;
  }

  async findOneWithResult(request: FindOneSurveyWithResultRepository.Request): FindOneSurveyWithResultRepository.Response {
    const { id } = request;

    const surveyWithResult = await this.prisma.survey.findUnique(
      {
        where: {
          id
        },

        include: {
          questions: {
            include: {
              answers: {
                include: {
                  userAnswers: true
                }
              }
            }
          },

          userAnsweredSurveys: {
            select: {
              id: true
            }
          }
        }
      }
    );

    return surveyWithResult;
  }
}

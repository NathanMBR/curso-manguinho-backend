import { PrismaClient } from "@prisma/client";

import { FindOneUserAnsweredSurveyRepository } from "../../../data/protocols";

export class PrismaUserAnsweredSurveyRepository implements FindOneUserAnsweredSurveyRepository.Protocol {
  constructor(
    private readonly prisma: PrismaClient
  ) {}

  async findOne(request: FindOneUserAnsweredSurveyRepository.Request): FindOneUserAnsweredSurveyRepository.Response {
    const {
      accountId,
      surveyId
    } = request;

    const userAnsweredSurvey = await this.prisma.userAnsweredSurvey.findFirst(
      {
        where: {
          accountId,
          surveyId
        }
      }
    );

    return userAnsweredSurvey;
  }
}

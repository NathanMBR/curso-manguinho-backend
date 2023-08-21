import { PrismaClient } from "@prisma/client";

import { AddUserAnswerRepository } from "../../../data/protocols";

export class PrismaUserAnswerRepository implements AddUserAnswerRepository.Protocol {
  constructor(
    private readonly prisma: PrismaClient
  ) {}

  async add(request: AddUserAnswerRepository.Request): AddUserAnswerRepository.Response {
    const {
      accountId,
      surveyId,
      userAnswers
    } = request;

    await this.prisma.$transaction(
      async transaction => {
        await transaction.userAnsweredSurvey.create(
          {
            data: {
              accountId,
              surveyId
            }
          }
        );

        await transaction.userAnswer.createMany(
          {
            data: userAnswers.map(
              userAnswer => {
                return {
                  accountId,
                  ...userAnswer
                }
              }
            )
          }
        );
      }
    );

    return;
  }
}

import { AddUserAnswerRepository } from "../../../../data/protocols";
import { prisma } from "../prisma";

export class PrismaUserAnswerRepository implements AddUserAnswerRepository.Protocol {
  async add(request: AddUserAnswerRepository.Request): AddUserAnswerRepository.Response {
    const {
      accountId,
      surveyId,
      userAnswers
    } = request;

    await prisma.$transaction(
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

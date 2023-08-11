import { AddUserAnswerRepository } from "../../../../data/protocols";
import { prisma } from "../prisma";

export class PrismaUserAnswerRepository implements AddUserAnswerRepository.Protocol {
  async add(request: AddUserAnswerRepository.Request): AddUserAnswerRepository.Response {
    const {
      accountId,
      userAnswers
    } = request;

    await prisma.userAnswer.createMany(
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

    return;
  }
}

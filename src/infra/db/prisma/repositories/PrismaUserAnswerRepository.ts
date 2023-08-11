import { AddUserAnswerRepository } from "../../../../data/protocols";
import { prisma } from "../prisma";

export class PrismaUserAnswerRepository implements AddUserAnswerRepository.Protocol {
  async add(request: AddUserAnswerRepository.Request): AddUserAnswerRepository.Response {
    const {
      accountId,
      questionId,
      answerId
    } = request;

    const userAnswer = await prisma.userAnswer.create(
      {
        data: {
          account: {
            connect: {
              id: accountId
            }
          },

          question: {
            connect: {
              id: questionId
            }
          },

          answer: {
            connect: {
              id: answerId
            }
          }
        }
      }
    );

    return userAnswer;
  }
}

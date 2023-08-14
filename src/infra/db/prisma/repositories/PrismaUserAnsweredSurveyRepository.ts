import { FindOneUserAnsweredSurveyRepository } from "../../../../data/protocols";
import { prisma } from "../prisma";

export class PrismaUserAnsweredSurveyRepository implements FindOneUserAnsweredSurveyRepository.Protocol {
  async findOne(request: FindOneUserAnsweredSurveyRepository.Request): FindOneUserAnsweredSurveyRepository.Response {
    const {
      accountId,
      surveyId
    } = request;

    const userAnsweredSurvey = await prisma.userAnsweredSurvey.findFirst(
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

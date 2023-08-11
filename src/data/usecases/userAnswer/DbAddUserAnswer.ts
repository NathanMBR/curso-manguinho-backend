import { AddUserAnswer } from "../../../domain/usecases";
import { AddUserAnswerRepository } from "../../protocols";

export class DbAddUserAnswer implements AddUserAnswer.Protocol {
  constructor(
    private readonly addUserAnswerRepository: AddUserAnswerRepository.Protocol
  ) {}

  async add(request: AddUserAnswer.Request): AddUserAnswer.Response {
    const userAnswer = await this.addUserAnswerRepository.add(request);

    return userAnswer;
  }
}

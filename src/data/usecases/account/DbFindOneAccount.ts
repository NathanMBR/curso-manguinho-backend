import { FindOneAccount } from "../../../domain/usecases";
import { FindOneAccountRepository } from "../../protocols";

export class DbFindOneAccount implements FindOneAccount.Protocol {
  constructor(
    private readonly findOneAccountRepository: FindOneAccountRepository.Protocol
  ) {}

  async findOne(request: FindOneAccount.Request): FindOneAccount.Response {
    const { id } = request;

    const account = await this.findOneAccountRepository.findOne(
      {
        id
      }
    );

    return account;
  }
}
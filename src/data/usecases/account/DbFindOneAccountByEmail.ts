import { FindOneAccountByEmail } from "../../../domain/usecases";
import { FindOneAccountByEmailRepository } from "../../protocols";

export class DbFindOneAccountByEmail implements FindOneAccountByEmail.Protocol {
  constructor(
    private readonly findOneAccountByEmailRepository: FindOneAccountByEmailRepository.Protocol
  ) {}

  async findOneByEmail(search: FindOneAccountByEmail.Request): FindOneAccountByEmail.Response {
    const { email } = search;

    const account = await this.findOneAccountByEmailRepository.findOneByEmail(
      {
        email
      }
    );

    return account;
  }
}
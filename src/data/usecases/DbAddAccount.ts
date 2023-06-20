import { AddAccount } from "../../domain/usecases";
import { AddAccountRepository, Encrypter } from "../protocols";

export class DbAddAccount implements AddAccount.Protocol {
  constructor(
    private readonly encrypter: Encrypter.Protocol,
    private readonly addAccountRepository: AddAccountRepository.Protocol
  ) {}

  async add(accountData: AddAccount.Request): AddAccount.Response {
    const {
      name,
      email,
      password
    } = accountData;

    const hashedPassword = await this.encrypter.encrypt(password);

    const account = await this.addAccountRepository.add(
      {
        name,
        email,
        password: hashedPassword
      }
    );

    return account;
  }
}
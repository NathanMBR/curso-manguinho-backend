import { AddAccount } from "../../domain/usecases";
import { Encrypter } from "../protocols";

export class DbAddAccount implements AddAccount.Protocol {
  constructor(
    private readonly encrypter: Encrypter.Protocol
  ) {}

  async add(account: AddAccount.Request): AddAccount.Response {
    const {
      name,
      email,
      password
    } = account;

    const hashedPassword = await this.encrypter.encrypt(password);

    return Promise.resolve(
      {
        id: "foo_id",
        name: name,
        email: email,
        password: hashedPassword
      }
    );
  }
}
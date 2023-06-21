import { AddAccountRepository } from "../../../../data/protocols";
import { prisma } from "../prisma";

export class PrismaAccountRepository implements AddAccountRepository.Protocol {
  async add(accountData: AddAccountRepository.Request) {
    const {
      name,
      email,
      password
    } = accountData;

    const account = await prisma.account.create(
      {
        data: {
          name,
          email,
          password
        }
      }
    );

    return account;
  }
}
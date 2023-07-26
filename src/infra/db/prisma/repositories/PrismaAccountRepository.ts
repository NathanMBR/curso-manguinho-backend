import {
  AddAccountRepository,
  FindOneAccountRepository,
  FindOneAccountByEmailRepository
} from "../../../../data/protocols";
import { prisma } from "../prisma";

export class PrismaAccountRepository implements
  AddAccountRepository.Protocol,
  FindOneAccountRepository.Protocol,
  FindOneAccountByEmailRepository.Protocol
{
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

  async findOne(search: FindOneAccountRepository.Request) {
    const { id } = search;

    const account = await prisma.account.findUnique(
      {
        where: {
          id
        }
      }
    );

    return account;
  }

  async findOneByEmail(search: FindOneAccountByEmailRepository.Request) {
    const { email } = search;

    const account = await prisma.account.findFirst(
      {
        where: {
          email
        }
      }
    );

    return account;
  }
}
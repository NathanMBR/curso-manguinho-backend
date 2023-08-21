import { PrismaClient } from "@prisma/client";

import {
  AddAccountRepository,
  FindOneAccountRepository,
  FindOneAccountByEmailRepository
} from "../../../data/protocols";

export class PrismaAccountRepository implements
  AddAccountRepository.Protocol,
  FindOneAccountRepository.Protocol,
  FindOneAccountByEmailRepository.Protocol
{
  constructor(
    private readonly prisma: PrismaClient
  ) {}

  async add(accountData: AddAccountRepository.Request) {
    const {
      name,
      email,
      password
    } = accountData;

    const account = await this.prisma.account.create(
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

    const account = await this.prisma.account.findUnique(
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

    const account = await this.prisma.account.findFirst(
      {
        where: {
          email
        }
      }
    );

    return account;
  }
}

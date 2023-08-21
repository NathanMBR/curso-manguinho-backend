import {
  DbFindOneAccountByEmail,
  DbAddAccount
} from "../../../data/usecases";
import { SignUpValidatorAdapter } from "../../../validation/adapters";
import { SignUpController } from "../../../presentation/controllers";
import { BcryptAdapter } from "../../../infra/cryptography";
import { PrismaAccountRepository } from "../../../infra/db";
import { prisma } from "../../config";
import { ZodSignUpValidator } from "../../../infra/validators";
import { PinoLoggerAdapter } from "../../../infra/log";
import { bcryptHashRounds } from "../../config";
import { ErrorHandlerControllerDecorator } from "../../decorators";

export const makeSignUpController = () => {
  const validator = new ZodSignUpValidator();
  const validatorAdapter = new SignUpValidatorAdapter(
    validator
  );

  const encrypter = new BcryptAdapter(bcryptHashRounds);
  const accountRepository = new PrismaAccountRepository(prisma);

  const dbFindOneAccountByEmail = new DbFindOneAccountByEmail(
    accountRepository
  );

  const dbAddAccount = new DbAddAccount(
    encrypter,
    accountRepository
  );

  const signUpController = new SignUpController(
    validatorAdapter,
    dbFindOneAccountByEmail,
    dbAddAccount
  );

  const logger = new PinoLoggerAdapter();

  const errorHandlerDecorator = new ErrorHandlerControllerDecorator(
    signUpController,
    logger
  );

  return errorHandlerDecorator;
};

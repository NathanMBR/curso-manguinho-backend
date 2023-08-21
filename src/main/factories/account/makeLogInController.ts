import {
  DbFindOneAccountByEmail,
  DbCompareAccountPassword,
  DbAuthenticateAccount
} from "../../../data/usecases";
import {
  BcryptAdapter,
  JWTAdapter
} from "../../../infra/cryptography";
import {
  bcryptHashRounds,
  JWT_SECRET,
  jwtExpirationTime
} from "../../config";
import { LogInValidatorAdapter } from "../../../validation/adapters";
import { LogInController } from "../../../presentation/controllers";
import { PrismaAccountRepository } from "../../../infra/db";
import { prisma } from "../../config";
import { ZodLogInValidator } from "../../../infra/validators";
import { PinoLoggerAdapter } from "../../../infra/log";
import { ErrorHandlerControllerDecorator } from "../../decorators";

export const makeLogInController = () => {
  const validator = new ZodLogInValidator();
  const validatorAdapter = new LogInValidatorAdapter(validator);

  const encrypter = new BcryptAdapter(bcryptHashRounds);
  const tokenSigner = new JWTAdapter(
    JWT_SECRET,
    jwtExpirationTime
  );

  const accountRepository = new PrismaAccountRepository(prisma);

  const dbFindOneAccountByEmail = new DbFindOneAccountByEmail(accountRepository);
  const dbCompareAccountPassword = new DbCompareAccountPassword(encrypter);
  const dbAuthenticateAccount = new DbAuthenticateAccount(tokenSigner);

  const logInController = new LogInController(
    validatorAdapter,
    dbFindOneAccountByEmail,
    dbCompareAccountPassword,
    dbAuthenticateAccount
  );

  const logger = new PinoLoggerAdapter();

  const errorHandlerDecorator = new ErrorHandlerControllerDecorator(
    logInController,
    logger
  );

  return errorHandlerDecorator;
};

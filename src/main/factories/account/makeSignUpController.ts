import {
  DbFindOneAccountByEmail,
  DbAddAccount
} from "../../../data/usecases";
import { SignUpController } from "../../../presentation/controllers";
import { BcryptAdapter } from "../../../infra/cryptography";
import { PrismaAccountRepository } from "../../../infra/db";
import { ZodSignUpValidator } from "../../../utils/zod";
import { PinoLoggerAdapter } from "../../../utils/pino";
import { bcryptHashRounds } from "../../config";
import { ErrorHandlerControllerDecorator } from "../../decorators";

export const makeSignUpController = () => {
  const validator = new ZodSignUpValidator();

  const encrypter = new BcryptAdapter(bcryptHashRounds);
  const accountRepository = new PrismaAccountRepository();

  const dbFindOneAccountByEmail = new DbFindOneAccountByEmail(
    accountRepository
  );

  const dbAddAccount = new DbAddAccount(
    encrypter,
    accountRepository
  );

  const signUpController = new SignUpController(
    validator,
    dbFindOneAccountByEmail,
    dbAddAccount
  );

  const logger = new PinoLoggerAdapter();

  const errorHandlerDecorator = new ErrorHandlerControllerDecorator(
    signUpController,
    logger,
  );

  return errorHandlerDecorator;
};
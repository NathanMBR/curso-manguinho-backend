import { ZodEmailValidatorAdapter } from "../../../utils/zod";
import { bcryptHashRounds } from "../../config";
import { BcryptAdapter } from "../../../infra/cryptography";
import { PrismaAccountRepository } from "../../../infra/db";
import { DbAddAccount } from "../../../data/usecases";
import { SignUpController } from "../../../presentation/controllers";

export const makeSignUpController = () => {
  const emailValidator = new ZodEmailValidatorAdapter();

  const encrypter = new BcryptAdapter(bcryptHashRounds);
  const accountRepository = new PrismaAccountRepository();

  const dbAddAccount = new DbAddAccount(
    encrypter,
    accountRepository
  );

  const signUpController = new SignUpController(
    emailValidator,
    dbAddAccount
  );

  return signUpController;
};
import {
  ZodFindOneSurveyValidator,
  ZodAddUserAnswerValidator
} from "../../../infra/validators";
import {
  FindOneSurveyValidatorAdapter,
  AddUserAnswerValidatorAdapter
} from "../../../validation/adapters";
import {
  PrismaSurveyRepository,
  PrismaUserAnswerRepository,
  PrismaUserAnsweredSurveyRepository
} from "../../../infra/db";
import {
  DbFindOneSurvey,
  DbAddUserAnswer,
  DbFindOneUserAnsweredSurvey
} from "../../../data/usecases";
import { prisma } from "../../config";
import { AddSurveyAnswerController } from "../../../presentation/controllers";
import { PinoLoggerAdapter } from "../../../infra/log";
import { ErrorHandlerControllerDecorator } from "../../decorators";

export const makeAddSurveyAnswerController = () => {
  const findOneSurveyValidator = new ZodFindOneSurveyValidator();
  const addUserAnswerValidator = new ZodAddUserAnswerValidator();

  const findOneSurveyValidatorAdapter = new FindOneSurveyValidatorAdapter(findOneSurveyValidator);
  const addUserAnswerValidatorAdapter = new AddUserAnswerValidatorAdapter(addUserAnswerValidator);

  const surveyRepository = new PrismaSurveyRepository(prisma);
  const userAnswerRepository = new PrismaUserAnswerRepository(prisma);
  const userAnsweredSurveyRepository = new PrismaUserAnsweredSurveyRepository(prisma);

  const dbFindOneSurvey = new DbFindOneSurvey(surveyRepository);
  const dbAddUserAnswer = new DbAddUserAnswer(userAnswerRepository);
  const dbFindOneUserAnsweredSurvey = new DbFindOneUserAnsweredSurvey(userAnsweredSurveyRepository);

  const addSurveyAnswerController = new AddSurveyAnswerController(
    findOneSurveyValidatorAdapter,
    addUserAnswerValidatorAdapter,
    dbFindOneSurvey,
    dbFindOneUserAnsweredSurvey,
    dbAddUserAnswer
  );

  const logger = new PinoLoggerAdapter();

  const errorHandlerControllerDecorator = new ErrorHandlerControllerDecorator(
    addSurveyAnswerController,
    logger
  );

  return errorHandlerControllerDecorator;
};

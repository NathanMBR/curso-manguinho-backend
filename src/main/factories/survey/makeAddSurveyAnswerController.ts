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
  PrismaUserAnswerRepository
} from "../../../infra/db";
import {
  DbFindOneSurvey,
  DbAddUserAnswer
} from "../../../data/usecases";
import { AddSurveyAnswerController } from "../../../presentation/controllers";
import { PinoLoggerAdapter } from "../../../infra/log";
import { ErrorHandlerControllerDecorator } from "../../decorators";

export const makeAddSurveyAnswerController = () => {
  const findOneSurveyValidator = new ZodFindOneSurveyValidator();
  const addUserAnswerValidator = new ZodAddUserAnswerValidator();

  const findOneSurveyValidatorAdapter = new FindOneSurveyValidatorAdapter(findOneSurveyValidator);
  const addUserAnswerValidatorAdapter = new AddUserAnswerValidatorAdapter(addUserAnswerValidator);

  const surveyRepository = new PrismaSurveyRepository();
  const userAnswerRepository = new PrismaUserAnswerRepository();

  const dbFindOneSurvey = new DbFindOneSurvey(surveyRepository);
  const dbAddUserAnswer = new DbAddUserAnswer(userAnswerRepository);

  const addSurveyAnswerController = new AddSurveyAnswerController(
    findOneSurveyValidatorAdapter,
    addUserAnswerValidatorAdapter,
    dbFindOneSurvey,
    dbAddUserAnswer
  );

  const logger = new PinoLoggerAdapter();

  const errorHandlerControllerDecorator = new ErrorHandlerControllerDecorator(
    addSurveyAnswerController,
    logger
  );

  return errorHandlerControllerDecorator;
};

import { ZodFindOneSurveyValidator } from "../../../infra/validators";
import { FindOneSurveyValidatorAdapter } from "../../../validation/adapters";
import { PrismaSurveyRepository } from "../../../infra/db";
import { DbFindOneSurvey } from "../../../data/usecases";
import { FindOneSurveyController } from "../../../presentation/controllers";
import { PinoLoggerAdapter } from "../../../infra/log";
import { ErrorHandlerControllerDecorator } from "../../decorators";

export const makeFindOneSurveyController = () => {
  const validator = new ZodFindOneSurveyValidator();
  const validatorAdapter = new FindOneSurveyValidatorAdapter(validator);

  const surveyRepository = new PrismaSurveyRepository();

  const dbFindOneSurvey = new DbFindOneSurvey(
    surveyRepository
  );

  const findOneSurveyController = new FindOneSurveyController(
    validatorAdapter,
    dbFindOneSurvey
  );

  const logger = new PinoLoggerAdapter();

  const errorHandlerDecorator = new ErrorHandlerControllerDecorator(
    findOneSurveyController,
    logger
  );

  return errorHandlerDecorator;
};

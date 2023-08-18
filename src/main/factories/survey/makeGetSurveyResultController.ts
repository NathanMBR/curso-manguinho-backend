import { ZodFindOneSurveyValidator } from "../../../infra/validators";
import { FindOneSurveyValidatorAdapter } from "../../../validation/adapters";
import { PrismaSurveyRepository } from "../../../infra/db";
import { DbGetSurveyResult } from "../../../data/usecases";
import { GetSurveyResultController } from "../../../presentation/controllers";
import { PinoLoggerAdapter } from "../../../infra/log";
import { ErrorHandlerControllerDecorator } from "../../decorators";

export const makeGetSurveyResultController = () => {
  const validator = new ZodFindOneSurveyValidator();
  const validatorAdapter = new FindOneSurveyValidatorAdapter(validator);

  const surveyRepository = new PrismaSurveyRepository();

  const dbGetSurveyResult = new DbGetSurveyResult(
    surveyRepository
  );

  const getSurveyResultController = new GetSurveyResultController(
    validatorAdapter,
    dbGetSurveyResult
  );

  const logger = new PinoLoggerAdapter();

  const errorHandlerDecorator = new ErrorHandlerControllerDecorator(
    getSurveyResultController,
    logger
  );

  return errorHandlerDecorator;
};

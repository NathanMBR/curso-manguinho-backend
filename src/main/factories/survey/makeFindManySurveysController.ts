import { ZodFindManySurveysValidator } from "../../../infra/validators";
import { FindManySurveysValidatorAdapter } from "../../../validation/adapters";
import { PrismaSurveyRepository } from "../../../infra/db";
import { DbFindManySurveys } from "../../../data/usecases";
import { prisma } from "../../config";
import { FindManySurveysController } from "../../../presentation/controllers";
import { PinoLoggerAdapter } from "../../../infra/log";
import { ErrorHandlerControllerDecorator } from "../../decorators";

export const makeFindManySurveysController = () => {
  const validator = new ZodFindManySurveysValidator();
  const validatorAdapter = new FindManySurveysValidatorAdapter(validator);

  const surveyRepository = new PrismaSurveyRepository(prisma);

  const dbFindManySurveys = new DbFindManySurveys(
    surveyRepository,
    surveyRepository
  );

  const findManySurveysController = new FindManySurveysController(
    validatorAdapter,
    dbFindManySurveys
  );

  const logger = new PinoLoggerAdapter();

  const errorHandlerDecorator = new ErrorHandlerControllerDecorator(
    findManySurveysController,
    logger
  );

  return errorHandlerDecorator;
};

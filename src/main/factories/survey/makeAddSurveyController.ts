import { DbAddSurvey } from "../../../data/usecases";
import { ZodAddSurveyValidator } from "../../../infra/validators";
import { AddSurveyValidatorAdapter } from "../../../validation/adapters";
import { PrismaSurveyRepository } from "../../../infra/db";
import { prisma } from "../../config";
import { AddSurveyController } from "../../../presentation/controllers";
import { PinoLoggerAdapter } from "../../../infra/log";
import { ErrorHandlerControllerDecorator } from "../../decorators";

export const makeAddSurveyController = () => {
  const validator = new ZodAddSurveyValidator();
  const validatorAdapter = new AddSurveyValidatorAdapter(validator);

  const surveyRepository = new PrismaSurveyRepository(prisma);

  const dbAddSurvey = new DbAddSurvey(surveyRepository);

  const addSurveyController = new AddSurveyController(
    validatorAdapter,
    dbAddSurvey
  );

  const logger = new PinoLoggerAdapter();

  const errorHandlerDecorator = new ErrorHandlerControllerDecorator(
    addSurveyController,
    logger
  );

  return errorHandlerDecorator;
};

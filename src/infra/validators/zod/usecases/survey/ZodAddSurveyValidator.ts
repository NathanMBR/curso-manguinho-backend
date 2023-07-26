import { AddSurveyValidator } from "../../../../../validation/protocols";
import { zodAddSurveySchema } from "../../schemas";
import { zodValidationAdapter } from "../../adapters";

export class ZodAddSurveyValidator implements AddSurveyValidator.Protocol {
  validate(data: AddSurveyValidator.Request): AddSurveyValidator.Response {
    const zodValidation = zodAddSurveySchema.safeParse(data);

    const validationResponse = zodValidationAdapter(zodValidation);
    return validationResponse;
  }
}
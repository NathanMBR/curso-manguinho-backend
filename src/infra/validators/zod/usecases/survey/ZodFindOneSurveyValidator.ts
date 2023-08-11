import { FindOneSurveyValidator } from "../../../../../validation/protocols";
import { zodFindOneSurveySchema } from "../../schemas";
import { zodValidationAdapter } from "../../adapters";

export class ZodFindOneSurveyValidator implements FindOneSurveyValidator.Protocol {
  validate(data: FindOneSurveyValidator.Request): FindOneSurveyValidator.Response {
    const zodValidation = zodFindOneSurveySchema.safeParse(data);

    const validationResponse = zodValidationAdapter(zodValidation);
    return validationResponse;
  }
}

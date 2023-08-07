import { FindManySurveysValidator } from "../../../../../validation/protocols";
import { zodFindManySurveysSchema } from "../../schemas";
import { zodValidationAdapter } from "../../adapters";

export class ZodFindManySurveysValidator implements FindManySurveysValidator.Protocol {
  validate(data: FindManySurveysValidator.Request): FindManySurveysValidator.Response {
    const zodValidation = zodFindManySurveysSchema.safeParse(data);

    const validationResponse = zodValidationAdapter(zodValidation);
    return validationResponse;
  }
}
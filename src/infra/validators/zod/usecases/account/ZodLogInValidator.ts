import { LogInValidator } from "../../../../../validation/protocols";
import { zodLogInSchema } from "../../schemas";
import { zodValidationAdapter } from "../../adapters";

export class ZodLogInValidator implements LogInValidator.Protocol {
  validate(data: LogInValidator.Request): LogInValidator.Response {
    const zodValidation = zodLogInSchema.safeParse(data);

    const validationResponse = zodValidationAdapter(zodValidation);
    return validationResponse;
  }
}
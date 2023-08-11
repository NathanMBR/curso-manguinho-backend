import { AddUserAnswerValidator } from "../../../../../validation/protocols";
import { zodAddUserAnswerSchema } from "../../schemas";
import { zodValidationAdapter } from "../../adapters";

export class ZodAddUserAnswerValidator implements AddUserAnswerValidator.Protocol {
  validate(data: AddUserAnswerValidator.Request): AddUserAnswerValidator.Response {
    const zodValidation = zodAddUserAnswerSchema.safeParse(data);

    const validationResponse = zodValidationAdapter(zodValidation);
    return validationResponse;
  }
}

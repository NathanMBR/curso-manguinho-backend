import { SignUpValidator } from "../../../validation/protocols";
import { zodSignUpSchema } from "./schemas"
import { zodValidationAdapter } from "./adapters";

export class ZodSignUpValidator implements SignUpValidator.Protocol {
  validate(data: unknown) {
    const zodValidation = zodSignUpSchema.safeParse(data);

    const validationResponse = zodValidationAdapter(zodValidation);
    return validationResponse;
  };
}
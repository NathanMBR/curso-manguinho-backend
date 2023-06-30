import { Validator } from "../../presentation/protocols";
import { zodSignUpSchema } from "./schemas"
import { zodValidationAdapter } from "./adapters";

export class ZodSignUpValidator implements Validator.Protocol {
  validate(data: unknown) {
    const zodValidation = zodSignUpSchema.safeParse(data);

    const validationResponse = zodValidationAdapter(zodValidation);
    return validationResponse;
  };
}
import { EmailValidator } from "../../presentation/protocols";
import { emailSchema } from "./schemas";

export class ZodEmailValidatorAdapter implements EmailValidator.Protocol {
  constructor() {}

  isValid(email: string) {
    const zodEmailValidator = emailSchema.safeParse(email); 

    return zodEmailValidator.success;
  };
}
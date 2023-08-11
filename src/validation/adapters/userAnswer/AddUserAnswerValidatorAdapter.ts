import { Validator } from "../../../presentation/protocols";
import { AddUserAnswerRequest } from "../../../presentation/models";
import { AddUserAnswerValidator } from "../../protocols";
import { adaptValidatorResponse } from "../../helpers";

export class AddUserAnswerValidatorAdapter implements Validator.Protocol<AddUserAnswerRequest> {
  constructor(
    private readonly addUserAnswerValidator: AddUserAnswerValidator.Protocol
  ) {}

  validate(data: Validator.Request): Validator.Response<AddUserAnswerRequest> {
    const userAnswerValidation = this.addUserAnswerValidator.validate(data);

    return adaptValidatorResponse(userAnswerValidation);
  }
}

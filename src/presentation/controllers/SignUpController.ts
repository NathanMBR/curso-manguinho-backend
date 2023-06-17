import {
  Controller
} from "../protocols";
import { MissingParamError } from "../errors";
import { HttpResponseHelper } from "../helpers";

export class SignUpController implements Controller.Protocol {
  constructor() {}

  handle(httpRequest: Controller.Request) {
    const requiredFields = [
      "name",
      "email",
      "password"
    ];

    for (const requiredField of requiredFields) {
      const fieldToCheck = httpRequest.body[requiredField];

      if (!fieldToCheck)
        return HttpResponseHelper.badRequest(
          new MissingParamError(requiredField)
        );
    }

    return HttpResponseHelper.ok("ok");
  }
}
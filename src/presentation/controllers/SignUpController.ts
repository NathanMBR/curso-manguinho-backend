import {
  HttpRequest,
  HttpResponse
} from "../protocols";
import { MissingParamError } from "../errors";

export class SignUpController {
  constructor() {}

  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name)
      return {
        statusCode: 400,
        body: new MissingParamError("name")
      };

    if (!httpRequest.body.email)
      return {
        statusCode: 400,
        body: new MissingParamError("email")
      };

    if (!httpRequest.body.password)
      return {
        statusCode: 400,
        body: new MissingParamError("password")
      };

    return {
      statusCode: 200,
      body: "ok"
    };
  }
}
import {
  HttpRequest,
  HttpResponse
} from "../protocols";

export class SignUpController {
  constructor() {}

  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name)
      return {
        statusCode: 400,
        body: new Error("Missing parameter: name")
      };

    if (!httpRequest.body.email)
      return {
        statusCode: 400,
        body: new Error("Missing parameter: email")
      };

    if (!httpRequest.body.password)
      return {
        statusCode: 400,
        body: new Error("Missing parameter: password")
      };

    return {
      statusCode: 500,
      body: new Error("Internal server error")
    };
  }
}
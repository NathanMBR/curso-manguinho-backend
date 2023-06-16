export class SignUpController {
  constructor() {}

  handle(httpRequest: any) {
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

      return {
        statusCode: 500,
        body: new Error("Internal server error")
      };
  }
}
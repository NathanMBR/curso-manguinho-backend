export class SignUpController {
  constructor() {}

  handle(httpRequest: any) {
    return {
      statusCode: 400,
      body: new Error("Missing parameter: name")
    };
  }
}
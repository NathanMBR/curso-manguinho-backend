export namespace Validator {
  export type Request = unknown;

  export type Response = {
    isValid: false;
    errorMessage: string;
  } | {
    isValid: true;
  };

  export interface Protocol {
    validate: (data: Validator.Request) => Validator.Response;
  }
}
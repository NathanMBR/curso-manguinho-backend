export namespace Validator {
  export type Request = unknown;

  export type Response = {
    isValid: boolean;
    errors: Array<string>;
  };

  export interface Protocol {
    validate: (data: Validator.Request) => Validator.Response;
  }
}
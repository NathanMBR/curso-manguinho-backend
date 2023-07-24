export namespace Validator {
  export type Request = unknown;

  export type Response<T> = {
    isValid: false;
    errorMessage: string;
  } | {
    isValid: true;
    data: T;
  };

  export interface Protocol<T> {
    validate: (data: Validator.Request) => Validator.Response<T>;
  }
}
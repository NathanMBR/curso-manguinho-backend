export namespace Encrypter {
  export type Request = string;
  export type Response = Promise<string>;

  export interface Protocol {
    encrypt(value: Encrypter.Request): Encrypter.Response;
  }
}
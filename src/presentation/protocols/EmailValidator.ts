export namespace EmailValidator {
  export interface Protocol {
    isValid: (email: string) => boolean;
  }
}
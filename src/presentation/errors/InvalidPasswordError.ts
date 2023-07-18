export class InvalidPasswordError extends Error {
  constructor() {
    super("The password isn't correct");
    this.name = "InvalidPasswordError";
  }
}
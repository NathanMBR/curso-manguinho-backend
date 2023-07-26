export class RequiredAuthenticationError extends Error {
  constructor() {
    super("Authentication is required");
    this.name = "RequiredAuthenticationError";
  }
}
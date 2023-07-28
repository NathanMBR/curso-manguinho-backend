export class MissingAuthenticationError extends Error {
  constructor() {
    super("Authentication is required");
    this.name = "MissingAuthenticationError";
  }
}
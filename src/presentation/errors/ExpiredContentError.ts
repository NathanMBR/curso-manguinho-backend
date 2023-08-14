export class ExpiredContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExpiredContentError";
  }
}

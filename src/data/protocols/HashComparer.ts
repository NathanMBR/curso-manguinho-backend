export namespace HashComparer {
  export type Request = {
    text: string;
    hash: string;
  };

  export type Response = Promise<boolean>;

  export interface Protocol {
    compare(request: HashComparer.Request): HashComparer.Response;
  }
}
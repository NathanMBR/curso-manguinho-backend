export namespace Logger {
  export interface Protocol {
    log: (text: string) => void;
  }
}
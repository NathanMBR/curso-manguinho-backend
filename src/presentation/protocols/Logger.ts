export namespace Logger {
  export interface Protocol {
    logError: (text: string) => void;
  }
}
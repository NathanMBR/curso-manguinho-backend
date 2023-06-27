export namespace Logger {
  type PayloadValues =
    string |
    Array<string> |

    number |
    Array<number> |

    boolean |
    Array<boolean> |

    undefined;

  export type Request = Record<string, PayloadValues>;
  export interface Protocol {
    logError: (payload: Logger.Request) => void;
  }
}
import { Logger } from "../../../data/protocols";
import { pinoInstance } from "./core";

export class PinoLoggerAdapter implements Logger.Protocol {
  logError(payload: Logger.Request) {
    pinoInstance.error(payload);
  };
}
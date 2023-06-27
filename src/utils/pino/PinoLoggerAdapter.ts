import { Logger } from "../../presentation/protocols";
import { pinoInstance } from "./pinoInstance";

export class PinoLoggerAdapter implements Logger.Protocol {
  logError(payload: Logger.Request) {
    pinoInstance.error(payload);
  };
}
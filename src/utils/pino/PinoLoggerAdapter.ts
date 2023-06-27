import { Logger } from "../../presentation/protocols";
import { pinoInstance } from "./pinoInstance";

export class PinoLoggerAdapter implements Logger.Protocol {
  logError(text: string) {
    pinoInstance.error(text);
  };
}
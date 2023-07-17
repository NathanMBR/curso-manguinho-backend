import { CompareAccountPassword } from "../../domain/usecases";
import { HashComparer } from "../protocols";

export class DbCompareAccountPassword implements CompareAccountPassword.Protocol {
  constructor(
    private readonly hashComparer: HashComparer.Protocol
  ) {}

  async comparePassword(request: CompareAccountPassword.Request): CompareAccountPassword.Response {
    const {
      password,
      hash
    } = request;

    const doesPasswordMatch = await this.hashComparer.compare(
      {
        text: password,
        hash
      }
    );

    return doesPasswordMatch;
  }
}
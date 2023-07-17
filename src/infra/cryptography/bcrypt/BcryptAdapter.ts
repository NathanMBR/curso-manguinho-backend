import bcrypt from "bcrypt";

import {
  Encrypter,
  HashComparer
} from "../../../data/protocols";

export class BcryptAdapter implements
  Encrypter.Protocol,
  HashComparer.Protocol
{
  constructor(
    private readonly rounds: number
  ) {}

  async encrypt(value: Encrypter.Request): Encrypter.Response {
    const hashedValue = await bcrypt.hash(value, this.rounds);

    return hashedValue;
  }

  async compare(request: HashComparer.Request): HashComparer.Response {
    const {
      text,
      hash
    } = request;

    const doesValuesMatch = await bcrypt.compare(text, hash);

    return doesValuesMatch;
  }
}
import bcrypt from "bcrypt";

import { Encrypter } from "../../../data/protocols";

export class BcryptAdapter implements Encrypter.Protocol {
  constructor(
    private readonly rounds: number
  ) {}

  async encrypt(value: string) {
    const hashedValue = await bcrypt.hash(value, this.rounds);
    return hashedValue;
  }
}
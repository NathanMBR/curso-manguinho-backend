import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";
import bcrypt from "bcrypt";

import { BcryptAdapter } from "./BcryptAdapter";

interface GetSUTEnvironmentResponse {
  SUT: BcryptAdapter,

  rounds: number
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  const rounds = 12;
  const SUT = new BcryptAdapter(rounds);

  return {
    SUT,

    rounds
  };
};

describe("Bcrypt Adapter", () => {
  it("should correctly hash the value", async () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(bcrypt, "hash").mockImplementationOnce(
      async () => Promise.resolve("hashed_value")
    );

    const SUTResponse = await SUT.encrypt("test1234");
    expect(SUTResponse).toBe("hashed_value");
  });

  it("should correctly call the encrypt adapter", async () => {
    const { SUT, rounds } = getSUTEnvironment();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    const password = "test1234";

    await SUT.encrypt(password);

    expect(hashSpy).toHaveBeenCalledWith(password, rounds);
  });
});
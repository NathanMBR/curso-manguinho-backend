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
  it("should successfully hash the value", async () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(bcrypt, "hash").mockImplementationOnce(
      async () => Promise.resolve("hashed_value")
    );

    const SUTResponse = await SUT.encrypt("test1234");
    expect(SUTResponse).toBe("hashed_value");
  });

  it("should pass string to bcrypt hash", async () => {
    const { SUT, rounds } = getSUTEnvironment();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    const password = "test1234";

    await SUT.encrypt(password);

    expect(hashSpy).toHaveBeenCalledWith(password, rounds);
  });

  it("should repass bcrypt errors to upper level", async () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(bcrypt, "hash").mockImplementationOnce(
      async () => {
        throw new Error();
      }
    );

    const SUTResponse = SUT.encrypt("test1234");
    await expect(SUTResponse).rejects.toThrow();
  });
});
import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";
import bcrypt from "bcrypt";

import { BcryptAdapter } from "./BcryptAdapter";

interface GetSUTEnvironmentResponse {
  rounds: number;

  SUT: BcryptAdapter;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  const rounds = 12;
  const SUT = new BcryptAdapter(rounds);

  return {
    rounds,

    SUT
  };
};

jest.spyOn(bcrypt, "hash").mockImplementation(
  async () => Promise.resolve("stub-hash")
);

jest.spyOn(bcrypt, "compare").mockImplementation(
  async () => Promise.resolve(true)
);

describe("Bcrypt Adapter Encrypt Method", () => {
  it("should successfully hash the value", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = "test1234";
    const SUTResponse = await SUT.encrypt(SUTRequest);

    expect(SUTResponse).toBe("stub-hash");
  });

  it("should pass text and rounds to bcrypt hash method", async () => {
    const { SUT, rounds } = getSUTEnvironment();

    const hashSpy = jest.spyOn(bcrypt, "hash");
    const SUTRequest = "test1234";

    await SUT.encrypt(SUTRequest);

    expect(hashSpy).toHaveBeenCalledWith(SUTRequest, rounds);
  });

  it("should repass bcrypt hash method errors to upper level", async () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(bcrypt, "hash").mockImplementationOnce(
      async () => {
        throw new Error();
      }
    );

    const SUTRequest = "test1234";
    const SUTResponse = SUT.encrypt(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });
});

describe("Bcrypt Adapter Compare Method", () => {
  it("should successfully compare the value", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      text: "test1234",
      hash: "test-hash"
    };

    const SUTResponse = await SUT.compare(SUTRequest);

    expect(SUTResponse).toBe(true);
  });

  it("should return false if bcrypt compare method returns false", async () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(bcrypt, "compare").mockImplementationOnce(
      async () => Promise.resolve(false)
    );

    const SUTRequest = {
      text: "test1234",
      hash: "test-hash"
    };

    const SUTResponse = await SUT.compare(SUTRequest);

    expect(SUTResponse).toBe(false);
  });

  it("should pass text and hash to bcrypt compare method", async () => {
    const { SUT } = getSUTEnvironment();

    const compareSpy = jest.spyOn(bcrypt, "compare");

    const SUTRequest = {
      text: "test1234",
      hash: "test-hash"
    };

    await SUT.compare(SUTRequest);

    expect(compareSpy).toHaveBeenCalledWith(SUTRequest.text, SUTRequest.hash);
  });

  it("should repass bcrypt compare method errors to upper level", async () => {
    const { SUT } = getSUTEnvironment();

    jest.spyOn(bcrypt, "compare").mockImplementationOnce(
      async () => {
        throw new Error();
      }
    );

    const SUTRequest = {
      text: "test1234",
      hash: "test-hash"
    };

    const SUTResponse = SUT.compare(SUTRequest);

    await expect(SUTResponse).rejects.toThrow();
  });
});
import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { DbCompareAccountPassword } from "./DbCompareAccountPassword";
import { HashComparer } from "../../protocols";

interface GetSUTEnvironmentResponse {
  hashComparer: HashComparer.Protocol;

  SUT: DbCompareAccountPassword;
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  class HashComparerStub implements HashComparer.Protocol {
    async compare(request: HashComparer.Request): HashComparer.Response {
      return Promise.resolve(true);
    }
  }

  const hashComparer = new HashComparerStub();

  const SUT = new DbCompareAccountPassword(
    hashComparer
  );

  return {
    hashComparer,

    SUT
  };
};

describe("DbCompareAccountPassword UseCase", () => {
  it("should successfully compare a password with a hash", async () => {
    const { SUT } = getSUTEnvironment();

    const SUTRequest = {
      password: "test1234",
      hash: "test-hash"
    };

    const SUTResponse = await SUT.comparePassword(SUTRequest);
    expect(SUTResponse).toBe(true);
  });

  it("should return false if password doesn't match hash", async () => {
    const { SUT, hashComparer } = getSUTEnvironment();

    jest.spyOn(hashComparer, "compare").mockReturnValueOnce(Promise.resolve(false));

    const SUTRequest = {
      password: "test1234",
      hash: "test-hash"
    };

    const SUTResponse = await SUT.comparePassword(SUTRequest);
    expect(SUTResponse).toBe(false);
  });

  it("should pass hash and password to hash comparer call", async () => {
    const { SUT, hashComparer } = getSUTEnvironment();

    const compareSpy = jest.spyOn(hashComparer, "compare");

    const SUTRequest = {
      password: "test1234",
      hash: "test-hash"
    };

    await SUT.comparePassword(SUTRequest);

    expect(compareSpy).toHaveBeenCalledWith(
      {
        text: SUTRequest.password,
        hash: SUTRequest.hash
      }
    );
  });

  it("should repass compare errors to upper level", async () => {
    const { SUT, hashComparer } = getSUTEnvironment();

    jest.spyOn(hashComparer, "compare").mockImplementationOnce(
      () => {
        throw new Error("Test error");
      }
    );

    const SUTRequest = {
      password: "test1234",
      hash: "test-hash"
    };

    const SUTResponse = SUT.comparePassword(SUTRequest);
    await expect(SUTResponse).rejects.toThrow();
  });
});
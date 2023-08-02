import {
  describe,
  it,
  expect,
  jest
} from "@jest/globals";

import { calculateRepositoryPaginationParameters } from "./calculateRepositoryPaginationParameters";

describe("calculateRepositoryPaginationParameters Helper", () => {
  it("should successfully calculate the pagination parameters", () => {
    const SUTRequest = {
      quantity: 10,
      page: 3
    };

    const SUTResponse = calculateRepositoryPaginationParameters(SUTRequest);

    const expectedResponse = {
      take: 10,
      skip: 20
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should not throw errors", () => {
    const SUTRequest = {
      quantity: 10,
      page: 3
    };

    const getSUTResponse = () => calculateRepositoryPaginationParameters(SUTRequest);

    expect(getSUTResponse).not.toThrow();
  });
});
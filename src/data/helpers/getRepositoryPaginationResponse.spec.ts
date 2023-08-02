import {
  describe,
  it,
  expect
} from "@jest/globals";

import { getRepositoryPaginationResponse } from "./getRepositoryPaginationResponse";

describe("getRepositoryPaginationResponse Helper", () => {
  it("should successfully get the repository pagination response", () => {
    const SUTRequest = {
      take: 10,
      skip: 10,
      count: 100,
      data: [
        {
          test: "test data"
        }
      ]
    };

    const SUTResponse = getRepositoryPaginationResponse(SUTRequest);

    const expectedResponse = {
      quantityPerPage: 10,
      total: 100,
      currentPage: 2,
      lastPage: 10,
      data: [
        {
          test: "test data"
        }
      ]
    };

    expect(SUTResponse).toEqual(expectedResponse);
  });

  it("should not throw errors", () => {
    const SUTRequest = {
      take: 10,
      skip: 10,
      count: 100,
      data: [
        {
          test: "test data"
        }
      ]
    };

    const getSUTResponse = () => getRepositoryPaginationResponse(SUTRequest);

    expect(getSUTResponse).not.toThrow();
  });
});
import { z as zod } from "zod";

export const zodFindManySurveysSchema = zod.object(
  {
    page: zod
      .coerce
      .number(
        {
          description: "The surveys page",
          required_error: "The surveys page is required",
          invalid_type_error: "The surveys page must be a number"
        }
      )
      .min(1, "The surveys page must be greater than or equal to 1")
      .int("The surveys page must be an integer number"),

    quantity: zod
      .coerce
      .number(
        {
          description: "The surveys quantity",
          required_error: "The surveys quantity is required",
          invalid_type_error: "The surveys quantity must be a number"
        }
      )
      .min(1, "The surveys quantity must be greater than or equal to 1")
      .max(50, "The surveys quantity must be less than or equal to 50")
      .int("The surveys quantity must be an integer number")
  },

  {
    description: "The find many surveys payload",
    required_error: "The find many surveys payload is required",
    invalid_type_error: "The find many surveys payload must be an object"
  }
);

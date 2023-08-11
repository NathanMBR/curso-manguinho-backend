import { z as zod } from "zod";

export const zodFindOneSurveySchema = zod.object(
  {
    id: zod
      .string(
        {
          description: "The survey ID",
          required_error: "The survey ID is required",
          invalid_type_error: "The survey ID must be a string"
        }
      )
      .uuid("The survey ID must be a valid UUID")
  },

  {
    description: "The find one survey payload",
    required_error: "The find one survey payload is required",
    invalid_type_error: "The find one survey payload must be an object"
  }
);

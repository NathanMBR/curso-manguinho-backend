import { z as zod } from "zod";

export const zodLogInSchema = zod.object(
  {
    email: zod
      .string(
        {
          description: "The log in email",
          required_error: "The log in email is required",
          invalid_type_error: "The log in email must be a string"
        }
      )
      .max(255, "The log in email must have at most 255 characters")
      .email("The log in email must be in a valid format"),

    password: zod
      .string(
        {
          description: "The log in password",
          required_error: "The log in password is required",
          invalid_type_error: "The log in password must be a string"
        }
      )
      .min(8, "The log in password must have at least 8 characters")
  },

  {
    description: "The log in payload",
    required_error: "The log in payload is required",
    invalid_type_error: "The log in payload must be an object"
  }
);
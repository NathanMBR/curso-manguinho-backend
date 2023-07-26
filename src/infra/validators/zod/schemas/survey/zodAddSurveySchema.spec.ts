import {
  describe,
  it,
  expect
} from "@jest/globals";
import {
  z as zod,
  SafeParseSuccess,
  SafeParseError,
  ZodIssue
} from "zod";

import { zodAddSurveySchema } from "./zodAddSurveySchema";

const getCharacters = (quantity: number): string => {
  const lowerCaseAlphabetStartCode = 97;
  const alphabetLength = 26;

  let characters = "";

  for (let i = 0; i < quantity; i++) {
    const randomCharacterCode = Math.floor(Math.random() * alphabetLength) + lowerCaseAlphabetStartCode;
    characters += String.fromCharCode(randomCharacterCode);
  }

  return characters;
};

interface GetSUTEnvironmentResponse {
  SUT: typeof zodAddSurveySchema
}

const getSUTEnvironment = (): GetSUTEnvironmentResponse => {
  return {
    SUT: zodAddSurveySchema
  }
};

describe("ZodAddSurvey Test", () => {
  it("should successfully validate an add survey payload", () => {
    const { SUT } = getSUTEnvironment();
    
    type SUTSuccess = SafeParseSuccess<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: new Date().toISOString(),
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },

            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTSuccess;

    expect(SUTResponse.success).toBe(true);
  });

  it("should successfully validate an add survey payload when question type is 'MULTIPLE'", () => {
    const { SUT } = getSUTEnvironment();
    
    type SUTSuccess = SafeParseSuccess<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: new Date().toISOString(),
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "MULTIPLE",
          answers: [
            {
              body: "test answer body 1"
            },

            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTSuccess;

    expect(SUTResponse.success).toBe(true);
  });

  it("should successfully validate an add survey payload with undefined optional properties", () => {
    const { SUT } = getSUTEnvironment();
    
    type SUTSuccess = SafeParseSuccess<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Test Survey Title",
      // description: "test survey description",
      // expiresAt: "Tue, 25 Jul 2023 22:38:51 GMT",
      questions: [
        {
          title: "Test Question Title",
          // description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },

            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTSuccess;

    expect(SUTResponse.success).toBe(true);
  });

  it("should successfully validate an add survey payload with null optional properties", () => {
    const { SUT } = getSUTEnvironment();

    type SUTSuccess = SafeParseSuccess<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Test Survey Title",
      description: null,
      expiresAt: null,
      questions: [
        {
          title: "Test Question Title",
          description: null,
          type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },

            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTSuccess;

    expect(SUTResponse.success).toBe(true);
  });

  it("should successfully cast all optional properties to null", () => {
    const { SUT } = getSUTEnvironment();
    
    type SUTSuccess = SafeParseSuccess<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Test Survey Title",
      description: undefined,
      expiresAt: undefined,
      questions: [
        {
          title: "Test Question Title",
          description: undefined,
          type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },

            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTSuccess;

    expect(SUTResponse.data.description).toBeNull();
    expect(SUTResponse.data.expiresAt).toBeNull();
    expect(SUTResponse.data.questions[0]!.description).toBeNull();
  });

  it("should successfully cast all non-date optional properties with empty strings to null", () => {
    const { SUT } = getSUTEnvironment();
    
    type SUTSuccess = SafeParseSuccess<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Test Survey Title",
      description: "",
      expiresAt: undefined, // because of internal zod validation process, this property won't be casted to null if it's an empty string
      questions: [
        {
          title: "Test Question Title",
          description: "",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },

            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTSuccess;

    expect(SUTResponse.data.description).toBeNull();
    expect(SUTResponse.data.questions[0]!.description).toBeNull();
  });

  it("should return an error if survey title isn't defined", () => {
    const { SUT } = getSUTEnvironment();
    
    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      // title: "Test Survey Title",
      description: "test survey description",
      expiresAt: new Date().toISOString(),
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },

            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey title is required");
  });

  it("should return an error if survey title isn't a string", () => {
    const { SUT } = getSUTEnvironment();
    
    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: false,
      description: "test survey description",
      expiresAt: new Date().toISOString(),
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },

            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey title must be a string");
  });

  it("should return an error if survey title isn't at least 3 characters long", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Te",
      description: "test survey description",
      expiresAt: new Date().toISOString(),
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },

            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };
    
    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;
    
    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey title must have at least 3 characters");
  });

  it("should return an error if survey title isn't at most 255 characters long", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: getCharacters(256),
      description: "test survey description",
      expiresAt: new Date().toISOString(),
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },

            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };
    
    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;
    
    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey title must have at most 255 characters");
  });

  it("should return an error if survey description isn't a string", () => {
    const { SUT } = getSUTEnvironment();
    
    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Test Survey Title",
      description: false,
      expiresAt: new Date().toISOString(),
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },

            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey description must be a string if defined");
  });

  it("should return an error if survey expires at isn't a string", () => {
    const { SUT } = getSUTEnvironment();
    
    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: false,
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },

            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey expiration date must be a string if defined");
  });

  it("should return an error if survey expires at isn't a valid ISO string", () => {
    const { SUT } = getSUTEnvironment();
    
    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: "invalid iso string",
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },

            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey expiration date must be a valid ISO string");
  });

  it("should return an error if survey questions isn't defined", () => {
    const { SUT } = getSUTEnvironment();
    
    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: new Date().toISOString(),
      // questions: [
      //   {
      //     title: "Test Question Title",
      //     description: "test question description",
      //     type: "SINGLE",
      //     answers: [
      //       {
      //         body: "test answer body 1"
      //       },

      //       {
      //         body: "test answer body 2"
      //       }
      //     ]
      //   }
      // ]
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey questions list is required");
  });

  it("should return an error if survey questions list isn't an array", () => {
    const { SUT } = getSUTEnvironment();
    
    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: new Date().toISOString(),
      questions: false
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey questions list must be an array");
  });

  it("should return an error if survey questions list doesn't have at least 1 question", () => {
    const { SUT } = getSUTEnvironment();
    
    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: new Date().toISOString(),
      questions: []
    };

    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey questions list must have at least 1 question");
  });

  it("should return an error if survey question isn't an object", () => {
    const { SUT } = getSUTEnvironment();
    
    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;
    
    const SUTRequest = {
      title: "Test Survey Title",
      description: "test survey description",
      expiresAt: new Date().toISOString(),
      questions: [
        false,
        false
      ]
    };
    
    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey question must be an object");
  });

  it("should return an error if survey question title isn't defined", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Test Survey Title",
      description: "Test Survey Description",
      expiresAt: new Date().toISOString(),
      questions: [
        {
          // title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },

            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };
    
    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;
    
    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey question title is required");
  });

  it("should return an error if survey question title isn't a string", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Test Survey Title",
      description: "Test Survey Description",
      expiresAt: new Date().toISOString(),
      questions: [
        {
          title: false,
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },

            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };
    
    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;
    
    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey question title must be a string");
  });

  it("should return an error if survey question title isn't at least 3 characters long", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Test Survey Title",
      description: "Test Survey Description",
      expiresAt: new Date().toISOString(),
      questions: [
        {
          title: "Te",
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },

            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };
    
    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;
    
    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey question title must have at least 3 characters");
  });

  it("should return an error if survey question title isn't at most 255 characters long", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Test Survey Title",
      description: "Test Survey Description",
      expiresAt: new Date().toISOString(),
      questions: [
        {
          title: getCharacters(256),
          description: "test question description",
          type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },

            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };
    
    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;
    
    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey question title must have at most 255 characters");
  });

  it("should return an error if survey question description isn't a string", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
      title: "Test Survey Title",
      // description: "Test Survey Description",
      expiresAt: new Date().toISOString(),
      questions: [
        {
          title: "Test Question Title",
          description: false,
          type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },
  
            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };
    
    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The survey question description must be a string if defined");
  });

  it("should return an error if survey question type isn't defined", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;
    
    const SUTRequest = {
      title: "Test Survey Title",
      description: "Test Survey Description",
      expiresAt: new Date().toISOString(),
      questions: [
        {
          title: "Test Question Title",
          // description: "test question description",
          // type: "SINGLE",
          answers: [
            {
              body: "test answer body 1"
            },
  
            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };
    
    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe('The survey question type is required');
  });

  it("should return an error if survey question type isn't a valid enum", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;
    
    const SUTRequest = {
      title: "Test Survey Title",
      description: "Test Survey Description",
      expiresAt: new Date().toISOString(),
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: false,
          answers: [
            {
              body: "test answer body 1"
            },
  
            {
              body: "test answer body 2"
            }
          ]
        }
      ]
    };
    
    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe('The survey question type must be "SINGLE" or "MULTIPLE"');
  });

  it("should return an error if question answers list isn't defined", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;
    
    const SUTRequest = {
      title: "Test Survey Title",
      description: "Test Survey Description",
      expiresAt: new Date().toISOString(),
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          // answers: [
          //   {
          //     body: "test answer body 1"
          //   },
  
          //   {
          //     body: "test answer body 2"
          //   }
          // ]
        }
      ]
    };
    
    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The question answers list is required");
  });

  it("should return an error if question answers list isn't an array", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;
    
    const SUTRequest = {
      title: "Test Survey Title",
      description: "Test Survey Description",
      expiresAt: new Date().toISOString(),
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: false
        }
      ]
    };
    
    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The question answers list must be an array");
  });

  it("should return an error if question answers list doesn't have at least 2 answers", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;
    
    const SUTRequest = {
      title: "Test Survey Title",
      description: "Test Survey Description",
      expiresAt: new Date().toISOString(),
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: []
        }
      ]
    };
    
    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The question answers list must have at least 2 answers");
  });

  it("should return an error if question answer isn't an object", () => {
    const { SUT } = getSUTEnvironment();

    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;
    
    const SUTRequest = {
      title: "Test Survey Title",
      description: "Test Survey Description",
      expiresAt: new Date().toISOString(),
      questions: [
        {
          title: "Test Question Title",
          description: "test question description",
          type: "SINGLE",
          answers: [
            false,
            false
          ]
        }
      ]
    };
    
    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;

    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The question answer must be an object");
  });

  it("should return an error if question answer body isn't defined", () => {
    const { SUT } = getSUTEnvironment();
    
    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
        title: "Test Survey Title",
        description: "Test Survey Description",
        expiresAt: new Date().toISOString(),
        questions: [
          {
            title: "Test Question Title",
            description: "test question description",
            type: "SINGLE",
            answers: [
              {
                // body: "test answer body 1"
              },
    
              {
                // body: "test answer body 2"
              }
            ]
          }
        ]
    };
    
    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;
    
    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The question answer body is required");
  });

  it("should return an error if question answer body isn't a string", () => {
    const { SUT } = getSUTEnvironment();
    
    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
        title: "Test Survey Title",
        description: "Test Survey Description",
        expiresAt: new Date().toISOString(),
        questions: [
          {
            title: "Test Question Title",
            description: "test question description",
            type: "SINGLE",
            answers: [
              {
                body: false
              },
    
              {
                body: false
              }
            ]
          }
        ]
    };
    
    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;
    
    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The question answer body must be a string");
  });

  it("should return an error if question answer body is empty", () => {
    const { SUT } = getSUTEnvironment();
    
    type SUTFailure = SafeParseError<zod.output<typeof SUT>>;

    const SUTRequest = {
        title: "Test Survey Title",
        description: "Test Survey Description",
        expiresAt: new Date().toISOString(),
        questions: [
          {
            title: "Test Question Title",
            description: "test question description",
            type: "SINGLE",
            answers: [
              {
                body: ""
              },
    
              {
                body: ""
              }
            ]
          }
        ]
    };
    
    const SUTResponse = SUT.safeParse(SUTRequest) as SUTFailure;
    const issue = SUTResponse.error.issues[0] as ZodIssue;
    
    expect(SUTResponse.success).toBe(false);
    expect(issue.message).toBe("The question answer body must not be empty");
  });
});
import { AddUserAnswer } from "../../../domain/usecases";
import { AddUserAnswerRepository } from "../../protocols";

export class DbAddUserAnswer implements AddUserAnswer.Protocol {
  constructor(
    private readonly addUserAnswerRepository: AddUserAnswerRepository.Protocol
  ) {}

  async add(request: AddUserAnswer.Request): AddUserAnswer.Response {
    const {
      survey,
      accountId,
      userAnswers
    } = request;

    const isSurveyExpired = survey.expiresAt && survey.expiresAt.getTime() <= Date.now();

    if (isSurveyExpired)
      return {
        success: false,
        error: {
          type: "EXPIRED_SURVEY",
          message: `Survey with ID "${survey.id}" is expired`
        }
      };

    const doesEveryQuestionBelongsToSurvey = userAnswers.every(
      userAnswer => survey.questions.some(
        question => question.id === userAnswer.questionId
      )
    );

    if (!doesEveryQuestionBelongsToSurvey)
      return {
        success: false,
        error: {
          type: "INVALID_PAYLOAD",
          message: "Some of the questions don't belong to the survey"
        }
      };

    const doesEveryAnswerBelongsToItsQuestion = userAnswers.every(
      userAnswer => survey.questions.find(
        question => question.id === userAnswer.questionId
      )!.answers.some(
        answer => answer.id === userAnswer.answerId
      )
    );

    if (!doesEveryAnswerBelongsToItsQuestion)
      return {
        success: false,
        error: {
          type: "INVALID_PAYLOAD",
          message: "Some of the answers don't belong to its question"
        }
      };

    const doesEveryQuestionHasAtLeastOneUserAnswer = survey.questions.every(
      question => userAnswers.some(
        userAnswer => userAnswer.questionId === question.id
      )
    );

    if (!doesEveryQuestionHasAtLeastOneUserAnswer)
      return {
        success: false,
        error: {
          type: "INVALID_PAYLOAD",
          message: "Some of the questions doesn't have at least one user answer"
        }
      };

    const doesSomeSingleTypeQuestionHasMoreThanOneUserAnswer = survey.questions
      .filter(question => question.type === "SINGLE")
      .some(
        question => {
          let count = 0;

          for (const userAnswer of userAnswers) {
            if (userAnswer.questionId === question.id)
              count++;
          }

          return count > 1;
        }
      );

    if (doesSomeSingleTypeQuestionHasMoreThanOneUserAnswer)
      return {
        success: false,
        error: {
          type: "INVALID_PAYLOAD",
          message: "Some of the single type questions has more than one user answer"
        }
      };

    const doesDuplicatedUserAnswerExists = userAnswers.some(
      (userAnswer, index) => {
        for (let i = index + 1; i < userAnswers.length; i++) {
          const anotherUserAnswer = userAnswers[i]!;
          const isQuestionIdDuplicated = anotherUserAnswer.questionId === userAnswer.questionId;
          const isAnswerIdDuplicated = anotherUserAnswer.answerId === userAnswer.answerId;

          if (isQuestionIdDuplicated && isAnswerIdDuplicated)
            return true;
        }

        return false;
      }
    );

    if (doesDuplicatedUserAnswerExists)
      return {
        success: false,
        error: {
          type: "INVALID_PAYLOAD",
          message: "Duplicated user answer"
        }
      };

    await this.addUserAnswerRepository.add(
      {
        accountId,
        userAnswers
      }
    );

    return {
      success: true
    };
  }
}

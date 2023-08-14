-- CreateTable
CREATE TABLE "user_answered_surveys" (
    "id" TEXT NOT NULL,
    "accountId" VARCHAR NOT NULL,
    "surveyId" VARCHAR NOT NULL,

    CONSTRAINT "user_answered_surveys_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_answered_surveys" ADD CONSTRAINT "user_answered_surveys_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_answered_surveys" ADD CONSTRAINT "user_answered_surveys_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

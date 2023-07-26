/*
  Warnings:

  - Added the required column `accountId` to the `surveys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "surveys" ADD COLUMN     "accountId" VARCHAR NOT NULL;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

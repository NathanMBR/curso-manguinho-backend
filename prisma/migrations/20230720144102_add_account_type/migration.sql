-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('COMMON', 'ADMIN');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "type" "AccountType" NOT NULL DEFAULT 'COMMON';

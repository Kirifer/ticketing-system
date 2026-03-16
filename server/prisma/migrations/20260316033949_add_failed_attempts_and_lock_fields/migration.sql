/*
  Warnings:

  - Made the column `failedAttempts` on table `Admin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "firstFailedAt" TIMESTAMP(3),
ALTER COLUMN "failedAttempts" SET NOT NULL;

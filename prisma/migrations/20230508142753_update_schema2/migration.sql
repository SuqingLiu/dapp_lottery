/*
  Warnings:

  - Added the required column `amountSpent` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tickets` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "amountSpent" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tickets" INTEGER NOT NULL;

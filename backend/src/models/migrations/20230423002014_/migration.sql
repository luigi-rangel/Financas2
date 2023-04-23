/*
  Warnings:

  - You are about to drop the column `lastDate` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "lastDate",
ADD COLUMN     "repetitions" INTEGER NOT NULL DEFAULT 1;

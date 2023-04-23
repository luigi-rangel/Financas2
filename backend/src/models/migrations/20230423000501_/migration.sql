/*
  Warnings:

  - The values [REDEEM,CORRECTION] on the enum `TicketType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TicketType_new" AS ENUM ('CALL', 'EXPENSE', 'INCOME');
ALTER TABLE "Ticket" ALTER COLUMN "action" TYPE "TicketType_new" USING ("action"::text::"TicketType_new");
ALTER TYPE "TicketType" RENAME TO "TicketType_old";
ALTER TYPE "TicketType_new" RENAME TO "TicketType";
DROP TYPE "TicketType_old";
COMMIT;

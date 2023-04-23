-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_parentId_fkey";

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

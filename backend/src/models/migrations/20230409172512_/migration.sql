-- DropForeignKey
ALTER TABLE "TicketTag" DROP CONSTRAINT "TicketTag_ticketId_fkey";

-- AddForeignKey
ALTER TABLE "TicketTag" ADD CONSTRAINT "TicketTag_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

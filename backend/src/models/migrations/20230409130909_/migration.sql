-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_parentId_fkey";

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "parentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

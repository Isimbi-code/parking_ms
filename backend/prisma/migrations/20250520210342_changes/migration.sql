/*
  Warnings:

  - Added the required column `spaceId` to the `carentries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bills" ADD COLUMN     "carEntryId" INTEGER;

-- AlterTable
ALTER TABLE "carentries" ADD COLUMN     "spaceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "carEntryId" INTEGER;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_carEntryId_fkey" FOREIGN KEY ("carEntryId") REFERENCES "carentries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carentries" ADD CONSTRAINT "carentries_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_carEntryId_fkey" FOREIGN KEY ("carEntryId") REFERENCES "carentries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

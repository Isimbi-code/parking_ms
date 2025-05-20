/*
  Warnings:

  - Added the required column `userId` to the `carentries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "carentries" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "carexits" (
    "id" SERIAL NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "entryDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exitDateTime" TIMESTAMP(3) NOT NULL,
    "chargedAmount" INTEGER NOT NULL DEFAULT 0,
    "parkingCode" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "carexits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "parkingId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carexits_plateNumber_key" ON "carexits"("plateNumber");

-- AddForeignKey
ALTER TABLE "carentries" ADD CONSTRAINT "carentries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carexits" ADD CONSTRAINT "carexits_parkingCode_fkey" FOREIGN KEY ("parkingCode") REFERENCES "parkings"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carexits" ADD CONSTRAINT "carexits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_parkingId_fkey" FOREIGN KEY ("parkingId") REFERENCES "parkings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

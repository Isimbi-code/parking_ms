/*
  Warnings:

  - You are about to drop the column `spaces` on the `parkings` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `parkings` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SpaceStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- AlterTable
ALTER TABLE "parkings" DROP COLUMN "spaces",
DROP COLUMN "status";

-- DropEnum
DROP TYPE "ParkingStatus";

-- CreateTable
CREATE TABLE "Space" (
    "id" SERIAL NOT NULL,
    "spaceNumber" INTEGER NOT NULL,
    "status" "SpaceStatus" NOT NULL DEFAULT 'AVAILABLE',
    "parkingId" INTEGER NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Space_spaceNumber_key" ON "Space"("spaceNumber");

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_parkingId_fkey" FOREIGN KEY ("parkingId") REFERENCES "parkings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `parking_slots` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "carentries" DROP CONSTRAINT "carentries_parkingCode_fkey";

-- DropForeignKey
ALTER TABLE "parking_slots" DROP CONSTRAINT "parking_slots_userId_fkey";

-- DropTable
DROP TABLE "parking_slots";

-- CreateTable
CREATE TABLE "parkings" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "spaces" INTEGER NOT NULL,
    "Fee" INTEGER NOT NULL,
    "status" "ParkingStatus" NOT NULL DEFAULT 'AVAILABLE',
    "location" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "parkings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parkings_code_key" ON "parkings"("code");

-- CreateIndex
CREATE UNIQUE INDEX "parkings_name_key" ON "parkings"("name");

-- AddForeignKey
ALTER TABLE "parkings" ADD CONSTRAINT "parkings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carentries" ADD CONSTRAINT "carentries_parkingCode_fkey" FOREIGN KEY ("parkingCode") REFERENCES "parkings"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

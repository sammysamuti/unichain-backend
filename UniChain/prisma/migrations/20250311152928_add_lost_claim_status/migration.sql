/*
  Warnings:

  - The values [DECLINED] on the enum `ClaimStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `LostClaim` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `isFound` on the `LostItem` table. All the data in the column will be lost.
  - Added the required column `foundItemId` to the `LostClaim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proofDetails` to the `LostClaim` table without a default value. This is not possible if the table is not empty.
  - Made the column `message` on table `LostClaim` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ownerId` on table `LostItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ClaimStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
ALTER TABLE "LostClaim" ALTER COLUMN "status" TYPE "ClaimStatus_new" USING ("status"::text::"ClaimStatus_new");
ALTER TYPE "ClaimStatus" RENAME TO "ClaimStatus_old";
ALTER TYPE "ClaimStatus_new" RENAME TO "ClaimStatus";
DROP TYPE "ClaimStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "LostItem" DROP CONSTRAINT "LostItem_ownerId_fkey";

-- AlterTable
ALTER TABLE "LostClaim" ADD COLUMN     "foundItemId" INTEGER NOT NULL,
ADD COLUMN     "proofDetails" TEXT NOT NULL,
ADD COLUMN     "returnedAt" TIMESTAMP(3),
ADD COLUMN     "reviewNote" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedBy" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "ClaimStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "message" SET NOT NULL;

-- AlterTable
ALTER TABLE "LostItem" DROP COLUMN "isFound",
ALTER COLUMN "ownerId" SET NOT NULL;

-- CreateTable
CREATE TABLE "FoundItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "dateFound" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT,
    "status" "ItemStatus" NOT NULL DEFAULT 'FOUND',
    "isReturned" BOOLEAN NOT NULL DEFAULT false,
    "finderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoundItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LostClaim_foundItemId_idx" ON "LostClaim"("foundItemId");

-- CreateIndex
CREATE INDEX "LostClaim_lostItemId_idx" ON "LostClaim"("lostItemId");

-- CreateIndex
CREATE INDEX "LostClaim_reviewedBy_idx" ON "LostClaim"("reviewedBy");

-- AddForeignKey
ALTER TABLE "LostItem" ADD CONSTRAINT "LostItem_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoundItem" ADD CONSTRAINT "FoundItem_finderId_fkey" FOREIGN KEY ("finderId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostClaim" ADD CONSTRAINT "LostClaim_foundItemId_fkey" FOREIGN KEY ("foundItemId") REFERENCES "FoundItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostClaim" ADD CONSTRAINT "LostClaim_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

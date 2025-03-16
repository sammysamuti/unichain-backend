/*
  Warnings:

  - You are about to drop the column `finder` on the `LostItem` table. All the data in the column will be lost.
  - You are about to drop the column `owner` on the `LostItem` table. All the data in the column will be lost.
  - The `ownerId` column on the `LostItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `finderId` column on the `LostItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `Batch` on the `Student` table. All the data in the column will be lost.
  - Changed the type of `userId` on the `LostClaim` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `batch` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LostClaim" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "LostItem" DROP COLUMN "finder",
DROP COLUMN "owner",
DROP COLUMN "ownerId",
ADD COLUMN     "ownerId" INTEGER,
DROP COLUMN "finderId",
ADD COLUMN     "finderId" INTEGER;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "Batch",
ADD COLUMN     "batch" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "LostClaim" ADD CONSTRAINT "LostClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostItem" ADD CONSTRAINT "LostItem_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostItem" ADD CONSTRAINT "LostItem_finderId_fkey" FOREIGN KEY ("finderId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

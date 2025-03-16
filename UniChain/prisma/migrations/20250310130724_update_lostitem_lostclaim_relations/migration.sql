/*
  Warnings:

  - You are about to drop the column `userId` on the `LostClaim` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `LostClaim` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `studentId` on the `StudentDegree` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `universityId` on the `StudentDegree` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "LostClaim" DROP CONSTRAINT "LostClaim_userId_fkey";

-- DropIndex
DROP INDEX "StudentDegree_studentId_key";

-- DropIndex
DROP INDEX "StudentDegree_universityId_key";

-- AlterTable
ALTER TABLE "LostClaim" DROP COLUMN "userId",
ADD COLUMN     "studentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StudentDegree" DROP COLUMN "studentId",
ADD COLUMN     "studentId" INTEGER NOT NULL,
DROP COLUMN "universityId",
ADD COLUMN     "universityId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "LostClaim" ADD CONSTRAINT "LostClaim_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

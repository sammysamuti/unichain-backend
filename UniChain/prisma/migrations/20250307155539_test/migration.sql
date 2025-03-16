/*
  Warnings:

  - You are about to drop the `Credential` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lostitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `serviceProvider` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Batch` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `university` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `University` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Credential" DROP CONSTRAINT "Credential_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Credential" DROP CONSTRAINT "Credential_universityId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_universityId_fkey";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "Batch" TEXT NOT NULL,
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "telegramId" TEXT,
ADD COLUMN     "university" TEXT NOT NULL,
ALTER COLUMN "universityId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "University" ADD COLUMN     "location" TEXT NOT NULL;

-- DropTable
DROP TABLE "Credential";

-- DropTable
DROP TABLE "lostitem";

-- DropTable
DROP TABLE "serviceProvider";

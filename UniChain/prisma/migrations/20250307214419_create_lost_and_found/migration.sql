/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `University` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `University` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `University` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "University" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "StudentDegree" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "nationalId" TEXT,
    "email" TEXT,
    "degreeName" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "graduationDate" TIMESTAMP(3) NOT NULL,
    "cgpa" TEXT NOT NULL,
    "honors" TEXT,
    "creditsEarned" INTEGER NOT NULL,
    "thesisTitle" TEXT,
    "universityName" TEXT NOT NULL,
    "universityAddress" TEXT NOT NULL,
    "accreditation" TEXT NOT NULL,
    "faculty" TEXT NOT NULL,
    "deanName" TEXT,
    "registrarName" TEXT,
    "certificateNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentDegree_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentDegree_studentId_key" ON "StudentDegree"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentDegree_universityId_key" ON "StudentDegree"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentDegree_email_key" ON "StudentDegree"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StudentDegree_certificateNumber_key" ON "StudentDegree"("certificateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "University_email_key" ON "University"("email");

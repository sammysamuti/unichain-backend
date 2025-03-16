-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('LOST', 'CLAIMED', 'FOUND', 'RETURNED');

-- AlterTable
ALTER TABLE "LostItem" ADD COLUMN     "category" TEXT,
ADD COLUMN     "status" "ItemStatus" NOT NULL DEFAULT 'LOST';

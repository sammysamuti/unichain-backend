-- CreateTable
CREATE TABLE "LostItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "dateLost" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "isFound" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" TEXT,
    "finderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "owner" TEXT,
    "finder" TEXT,

    CONSTRAINT "LostItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LostClaim" (
    "id" SERIAL NOT NULL,
    "lostItemId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LostClaim_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LostClaim" ADD CONSTRAINT "LostClaim_lostItemId_fkey" FOREIGN KEY ("lostItemId") REFERENCES "LostItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

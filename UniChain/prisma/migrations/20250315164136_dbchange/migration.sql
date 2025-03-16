-- CreateTable
CREATE TABLE "upcomingSession" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "upcomingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supportCommunity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "member" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "supportCommunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lottery" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "winner" TEXT NOT NULL,
    "prize" TEXT NOT NULL,

    CONSTRAINT "Lottery_pkey" PRIMARY KEY ("id")
);

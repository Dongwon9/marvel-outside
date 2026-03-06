-- CreateTable
CREATE TABLE "BoardSubscription" (
    "userId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BoardSubscription_pkey" PRIMARY KEY ("userId","boardId")
);

-- CreateIndex
CREATE INDEX "BoardSubscription_userId_idx" ON "BoardSubscription"("userId");

-- CreateIndex
CREATE INDEX "BoardSubscription_boardId_idx" ON "BoardSubscription"("boardId");

-- AddForeignKey
ALTER TABLE "BoardSubscription" ADD CONSTRAINT "BoardSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardSubscription" ADD CONSTRAINT "BoardSubscription_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

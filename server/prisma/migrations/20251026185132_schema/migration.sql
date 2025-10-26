-- CreateTable
CREATE TABLE "GridCell" (
    "id" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "character" VARCHAR(10) NOT NULL,
    "playerId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GridCell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "hasSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "lastSubmitted" TIMESTAMP(3),
    "cooldownExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GridHistory" (
    "id" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "character" VARCHAR(10) NOT NULL,
    "playerId" TEXT NOT NULL,
    "action" TEXT NOT NULL DEFAULT 'UPDATE',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GridHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GridCell_x_y_idx" ON "GridCell"("x", "y");

-- CreateIndex
CREATE UNIQUE INDEX "GridCell_x_y_key" ON "GridCell"("x", "y");

-- CreateIndex
CREATE UNIQUE INDEX "Player_sessionId_key" ON "Player"("sessionId");

-- CreateIndex
CREATE INDEX "Player_sessionId_idx" ON "Player"("sessionId");

-- CreateIndex
CREATE INDEX "GridHistory_timestamp_idx" ON "GridHistory"("timestamp");

-- CreateIndex
CREATE INDEX "GridHistory_playerId_idx" ON "GridHistory"("playerId");

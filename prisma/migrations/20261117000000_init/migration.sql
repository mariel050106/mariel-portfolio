-- CreateTable
CREATE TABLE "CreatorPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'TikTok',
    "contentType" TEXT NOT NULL DEFAULT 'Short video',
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "views" INTEGER NOT NULL DEFAULT 0,
    "link" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "CreatorPost_createdAt_idx" ON "CreatorPost"("createdAt");
CREATE INDEX "CreatorPost_platform_idx" ON "CreatorPost"("platform");
CREATE INDEX "CreatorPost_status_idx" ON "CreatorPost"("status");

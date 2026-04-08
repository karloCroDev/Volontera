-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "senderId" TEXT;

-- CreateIndex
CREATE INDEX "Notification_senderId_createdAt_idx" ON "Notification"("senderId", "createdAt");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

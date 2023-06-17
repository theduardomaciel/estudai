/*
  Warnings:

  - You are about to drop the `_activity_interacted` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_attachment_interacted` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_event_interacted` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_test_interacted` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_activity_interacted" DROP CONSTRAINT "_activity_interacted_A_fkey";

-- DropForeignKey
ALTER TABLE "_activity_interacted" DROP CONSTRAINT "_activity_interacted_B_fkey";

-- DropForeignKey
ALTER TABLE "_attachment_interacted" DROP CONSTRAINT "_attachment_interacted_A_fkey";

-- DropForeignKey
ALTER TABLE "_attachment_interacted" DROP CONSTRAINT "_attachment_interacted_B_fkey";

-- DropForeignKey
ALTER TABLE "_event_interacted" DROP CONSTRAINT "_event_interacted_A_fkey";

-- DropForeignKey
ALTER TABLE "_event_interacted" DROP CONSTRAINT "_event_interacted_B_fkey";

-- DropForeignKey
ALTER TABLE "_test_interacted" DROP CONSTRAINT "_test_interacted_A_fkey";

-- DropForeignKey
ALTER TABLE "_test_interacted" DROP CONSTRAINT "_test_interacted_B_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "_activity_interacted";

-- DropTable
DROP TABLE "_attachment_interacted";

-- DropTable
DROP TABLE "_event_interacted";

-- DropTable
DROP TABLE "_test_interacted";

-- CreateTable
CREATE TABLE "attachments_interactions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attachmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "attachments_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities_interactions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "activities_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interacted_tests" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "testId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "interacted_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events_interactions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "events_interactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "attachments_interactions" ADD CONSTRAINT "attachments_interactions_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments_interactions" ADD CONSTRAINT "attachments_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities_interactions" ADD CONSTRAINT "activities_interactions_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities_interactions" ADD CONSTRAINT "activities_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interacted_tests" ADD CONSTRAINT "interacted_tests_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interacted_tests" ADD CONSTRAINT "interacted_tests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_interactions" ADD CONSTRAINT "events_interactions_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_interactions" ADD CONSTRAINT "events_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

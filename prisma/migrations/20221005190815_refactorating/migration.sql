/*
  Warnings:

  - You are about to drop the column `id_token` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `attachments` table. All the data in the column will be lost.
  - You are about to drop the column `testId` on the `attachments` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `courseType` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tests` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `access_token` on table `accounts` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `createdAt` to the `groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pinnedMessage` to the `groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contents` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_eventId_fkey";

-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_testId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_groupId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_userId_fkey";

-- DropForeignKey
ALTER TABLE "tests" DROP CONSTRAINT "tests_groupId_fkey";

-- DropForeignKey
ALTER TABLE "tests" DROP CONSTRAINT "tests_userId_fkey";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "id_token",
DROP COLUMN "refresh_token",
ADD COLUMN     "google_access_token" TEXT,
ADD COLUMN     "google_expires_at" INTEGER,
ADD COLUMN     "google_refresh_token" TEXT,
ALTER COLUMN "access_token" SET NOT NULL;

-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "eventId",
DROP COLUMN "testId";

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "admins" INTEGER[],
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "pinnedMessage" TEXT NOT NULL,
ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subgroups" JSONB[];

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "subject",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "concludedBy" INTEGER[],
ADD COLUMN     "contents" JSONB NOT NULL,
ADD COLUMN     "questionsAmount" INTEGER,
ADD COLUMN     "subjects" INTEGER[],
ADD COLUMN     "title" TEXT,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "courseType",
ADD COLUMN     "course" INTEGER;

-- DropTable
DROP TABLE "events";

-- DropTable
DROP TABLE "tests";

-- CreateTable
CREATE TABLE "_GroupToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToUser_AB_unique" ON "_GroupToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToUser_B_index" ON "_GroupToUser"("B");

-- AddForeignKey
ALTER TABLE "_GroupToUser" ADD CONSTRAINT "_GroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToUser" ADD CONSTRAINT "_GroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

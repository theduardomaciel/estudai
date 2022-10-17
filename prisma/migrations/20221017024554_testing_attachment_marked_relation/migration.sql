/*
  Warnings:

  - You are about to drop the column `attachmentId` on the `users` table. All the data in the column will be lost.
  - Made the column `userId` on table `attachments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_userId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_attachmentId_fkey";

-- AlterTable
ALTER TABLE "attachments" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "attachmentId";

-- CreateTable
CREATE TABLE "_marked" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_marked_AB_unique" ON "_marked"("A", "B");

-- CreateIndex
CREATE INDEX "_marked_B_index" ON "_marked"("B");

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_marked" ADD CONSTRAINT "_marked_A_fkey" FOREIGN KEY ("A") REFERENCES "attachments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_marked" ADD CONSTRAINT "_marked_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

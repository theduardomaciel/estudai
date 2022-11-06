/*
  Warnings:

  - You are about to drop the column `admins` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the `_group_interaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_interacted` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_marked` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `contents` on the `tasks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_group_interaction" DROP CONSTRAINT "_group_interaction_A_fkey";

-- DropForeignKey
ALTER TABLE "_group_interaction" DROP CONSTRAINT "_group_interaction_B_fkey";

-- DropForeignKey
ALTER TABLE "_interacted" DROP CONSTRAINT "_interacted_A_fkey";

-- DropForeignKey
ALTER TABLE "_interacted" DROP CONSTRAINT "_interacted_B_fkey";

-- DropForeignKey
ALTER TABLE "_marked" DROP CONSTRAINT "_marked_A_fkey";

-- DropForeignKey
ALTER TABLE "_marked" DROP CONSTRAINT "_marked_B_fkey";

-- AlterTable
ALTER TABLE "groups" DROP COLUMN "admins";

-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "contents",
ADD COLUMN     "contents" JSONB NOT NULL;

-- DropTable
DROP TABLE "_group_interaction";

-- DropTable
DROP TABLE "_interacted";

-- DropTable
DROP TABLE "_marked";

-- CreateTable
CREATE TABLE "_admin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_group_interacted" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_attachment_interacted" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_task_interacted" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_admin_AB_unique" ON "_admin"("A", "B");

-- CreateIndex
CREATE INDEX "_admin_B_index" ON "_admin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_group_interacted_AB_unique" ON "_group_interacted"("A", "B");

-- CreateIndex
CREATE INDEX "_group_interacted_B_index" ON "_group_interacted"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_attachment_interacted_AB_unique" ON "_attachment_interacted"("A", "B");

-- CreateIndex
CREATE INDEX "_attachment_interacted_B_index" ON "_attachment_interacted"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_task_interacted_AB_unique" ON "_task_interacted"("A", "B");

-- CreateIndex
CREATE INDEX "_task_interacted_B_index" ON "_task_interacted"("B");

-- AddForeignKey
ALTER TABLE "_admin" ADD CONSTRAINT "_admin_A_fkey" FOREIGN KEY ("A") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_admin" ADD CONSTRAINT "_admin_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_group_interacted" ADD CONSTRAINT "_group_interacted_A_fkey" FOREIGN KEY ("A") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_group_interacted" ADD CONSTRAINT "_group_interacted_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_attachment_interacted" ADD CONSTRAINT "_attachment_interacted_A_fkey" FOREIGN KEY ("A") REFERENCES "attachments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_attachment_interacted" ADD CONSTRAINT "_attachment_interacted_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_task_interacted" ADD CONSTRAINT "_task_interacted_A_fkey" FOREIGN KEY ("A") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_task_interacted" ADD CONSTRAINT "_task_interacted_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

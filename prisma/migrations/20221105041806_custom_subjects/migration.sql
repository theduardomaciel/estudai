/*
  Warnings:

  - You are about to drop the column `taskId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Subgroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subgroup" DROP CONSTRAINT "Subgroup_groupId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_subgroupId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_subgroupId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_taskId_fkey";

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "taskId";

-- DropTable
DROP TABLE "Subgroup";

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subgroups" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "subgroups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_interacted" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Subject_id_key" ON "Subject"("id");

-- CreateIndex
CREATE UNIQUE INDEX "subgroups_id_key" ON "subgroups"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_interacted_AB_unique" ON "_interacted"("A", "B");

-- CreateIndex
CREATE INDEX "_interacted_B_index" ON "_interacted"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_subgroupId_fkey" FOREIGN KEY ("subgroupId") REFERENCES "subgroups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subgroups" ADD CONSTRAINT "subgroups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_subgroupId_fkey" FOREIGN KEY ("subgroupId") REFERENCES "subgroups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_interacted" ADD CONSTRAINT "_interacted_A_fkey" FOREIGN KEY ("A") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_interacted" ADD CONSTRAINT "_interacted_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

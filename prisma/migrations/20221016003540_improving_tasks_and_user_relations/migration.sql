/*
  Warnings:

  - You are about to drop the column `subgroups` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `concludedBy` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "groups" DROP COLUMN "subgroups",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "pinnedMessage" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "concludedBy",
ADD COLUMN     "subgroupId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "attachmentId" TEXT,
ADD COLUMN     "taskId" INTEGER;

-- CreateTable
CREATE TABLE "Subgroup" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "Subgroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subgroup_id_key" ON "Subgroup"("id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subgroup" ADD CONSTRAINT "Subgroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_subgroupId_fkey" FOREIGN KEY ("subgroupId") REFERENCES "Subgroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

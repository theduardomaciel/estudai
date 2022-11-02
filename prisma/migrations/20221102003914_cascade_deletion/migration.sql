-- DropForeignKey
ALTER TABLE "Subgroup" DROP CONSTRAINT "Subgroup_groupId_fkey";

-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_taskId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_groupId_fkey";

-- AddForeignKey
ALTER TABLE "Subgroup" ADD CONSTRAINT "Subgroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

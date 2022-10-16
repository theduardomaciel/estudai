/*
  Warnings:

  - The `description` column on the `tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `taskId` on table `attachments` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `date` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_taskId_fkey";

-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_userId_fkey";

-- AlterTable
ALTER TABLE "attachments" ALTER COLUMN "taskId" SET NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "description",
ADD COLUMN     "description" JSONB;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

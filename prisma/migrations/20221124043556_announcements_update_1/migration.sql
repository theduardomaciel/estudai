/*
  Warnings:

  - Made the column `materialPrice` on table `Announcement` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_userId_fkey";

-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "visualizationsCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "materialPrice" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

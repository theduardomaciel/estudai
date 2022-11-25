/*
  Warnings:

  - The `visualizationsCount` column on the `Announcement` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Announcement" ALTER COLUMN "materialCondition" SET DATA TYPE TEXT,
DROP COLUMN "visualizationsCount",
ADD COLUMN     "visualizationsCount" TEXT[];

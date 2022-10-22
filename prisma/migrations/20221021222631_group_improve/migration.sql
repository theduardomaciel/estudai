/*
  Warnings:

  - Made the column `shareLink` on table `groups` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "groups" ALTER COLUMN "shareLink" SET NOT NULL;

/*
  Warnings:

  - You are about to drop the column `link` on the `attachments` table. All the data in the column will be lost.
  - Added the required column `downloadLink` to the `attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileId` to the `attachments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "expires_at" SET DATA TYPE BIGINT,
ALTER COLUMN "google_expires_at" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "link",
ADD COLUMN     "downloadLink" TEXT NOT NULL,
ADD COLUMN     "fileId" TEXT NOT NULL,
ADD COLUMN     "viewLink" TEXT;

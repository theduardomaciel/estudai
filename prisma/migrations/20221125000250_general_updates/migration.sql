/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[access_token]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Announcement" ALTER COLUMN "whatsAppNumber" SET DATA TYPE TEXT,
ALTER COLUMN "phoneNumber" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_id_key" ON "accounts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_access_token_key" ON "accounts"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

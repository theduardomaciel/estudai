/*
  Warnings:

  - You are about to drop the column `period` on the `tests` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TaskPrivacy" AS ENUM ('PUBLIC_FULL', 'PUBLIC_ATTACHMENTS', 'PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "isMandatory" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "privacy" "TaskPrivacy" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "isMandatory" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "privacy" "TaskPrivacy" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "tests" DROP COLUMN "period",
ADD COLUMN     "isMandatory" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxScore" DOUBLE PRECISION DEFAULT 10,
ADD COLUMN     "privacy" "TaskPrivacy" NOT NULL DEFAULT 'PUBLIC';

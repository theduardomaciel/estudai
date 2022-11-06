/*
  Warnings:

  - You are about to drop the column `subjects` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "subjects";

-- CreateTable
CREATE TABLE "_SubjectToTask" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SubjectToTask_AB_unique" ON "_SubjectToTask"("A", "B");

-- CreateIndex
CREATE INDEX "_SubjectToTask_B_index" ON "_SubjectToTask"("B");

-- AddForeignKey
ALTER TABLE "_SubjectToTask" ADD CONSTRAINT "_SubjectToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToTask" ADD CONSTRAINT "_SubjectToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

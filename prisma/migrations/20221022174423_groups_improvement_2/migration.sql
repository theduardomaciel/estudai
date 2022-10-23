-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "subgroupId" TEXT;

-- CreateTable
CREATE TABLE "_group_interaction" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_group_interaction_AB_unique" ON "_group_interaction"("A", "B");

-- CreateIndex
CREATE INDEX "_group_interaction_B_index" ON "_group_interaction"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_subgroupId_fkey" FOREIGN KEY ("subgroupId") REFERENCES "Subgroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_group_interaction" ADD CONSTRAINT "_group_interaction_A_fkey" FOREIGN KEY ("A") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_group_interaction" ADD CONSTRAINT "_group_interaction_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

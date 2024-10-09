-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_progressId_fkey";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Progress" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "_GroupToProgress" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToProgress_AB_unique" ON "_GroupToProgress"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToProgress_B_index" ON "_GroupToProgress"("B");

-- AddForeignKey
ALTER TABLE "_GroupToProgress" ADD CONSTRAINT "_GroupToProgress_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToProgress" ADD CONSTRAINT "_GroupToProgress_B_fkey" FOREIGN KEY ("B") REFERENCES "Progress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

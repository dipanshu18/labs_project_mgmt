/*
  Warnings:

  - You are about to drop the `_GroupToProgress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `groupId` to the `Progress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_GroupToProgress" DROP CONSTRAINT "_GroupToProgress_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToProgress" DROP CONSTRAINT "_GroupToProgress_B_fkey";

-- AlterTable
ALTER TABLE "Progress" ADD COLUMN     "groupId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_GroupToProgress";

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

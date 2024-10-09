/*
  Warnings:

  - Added the required column `batch` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `division` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Division" AS ENUM ('A', 'B');

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "batch" INTEGER NOT NULL,
ADD COLUMN     "division" "Division" NOT NULL;

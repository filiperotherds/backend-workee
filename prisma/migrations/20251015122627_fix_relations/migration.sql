/*
  Warnings:

  - You are about to drop the column `owner_id` on the `project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."project" DROP CONSTRAINT "project_owner_id_fkey";

-- AlterTable
ALTER TABLE "project" DROP COLUMN "owner_id";

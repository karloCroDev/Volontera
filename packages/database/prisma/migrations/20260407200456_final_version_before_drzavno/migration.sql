/*
  Warnings:

  - You are about to drop the column `isBanned` on the `OrganizationMember` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "AdditionalLinks_organizationInfoId_url_key";

-- DropIndex
DROP INDEX "OrganizationChannels_organizationId_name_key";

-- DropIndex
DROP INDEX "OrganizationTasksBoards_organizationId_title_key";

-- AlterTable
ALTER TABLE "OrganizationMember" DROP COLUMN "isBanned";

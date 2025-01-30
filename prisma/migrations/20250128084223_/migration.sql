/*
  Warnings:

  - The values [Closed_Paid] on the enum `Auction_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `auction` ADD COLUMN `resi` VARCHAR(191) NULL,
    MODIFY `status` ENUM('Unstarted', 'OnGoing', 'Closed_NoBid', 'Closed_Unpaid', 'Closed_OnPreparation', 'Closed_OnSent', 'Closed_Done') NOT NULL DEFAULT 'Unstarted';

-- DropForeignKey
ALTER TABLE `auction` DROP FOREIGN KEY `Auction_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `auction` DROP FOREIGN KEY `Auction_userId_fkey`;

-- DropForeignKey
ALTER TABLE `bid` DROP FOREIGN KEY `Bid_auctionId_fkey`;

-- DropForeignKey
ALTER TABLE `bid` DROP FOREIGN KEY `Bid_userId_fkey`;

-- DropIndex
DROP INDEX `Auction_categoryId_fkey` ON `auction`;

-- DropIndex
DROP INDEX `Auction_userId_fkey` ON `auction`;

-- DropIndex
DROP INDEX `Bid_auctionId_fkey` ON `bid`;

-- DropIndex
DROP INDEX `Bid_userId_fkey` ON `bid`;

-- AddForeignKey
ALTER TABLE `Auction` ADD CONSTRAINT `Auction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Auction` ADD CONSTRAINT `Auction_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bid` ADD CONSTRAINT `Bid_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bid` ADD CONSTRAINT `Bid_auctionId_fkey` FOREIGN KEY (`auctionId`) REFERENCES `Auction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

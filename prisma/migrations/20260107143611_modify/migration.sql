/*
  Warnings:

  - The values [BASIC,PRODUCTION] on the enum `User_subscriptionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Subscription` DROP FOREIGN KEY `Subscription_userId_fkey`;

-- DropIndex
DROP INDEX `Subscription_stripeSubscriptionId_key` ON `Subscription`;

-- DropIndex
DROP INDEX `Subscription_userId_key` ON `Subscription`;

-- AlterTable
ALTER TABLE `User` MODIFY `subscriptionStatus` ENUM('FREE', 'STARTER', 'PRO', 'ENTERPRISE') NOT NULL DEFAULT 'FREE';

-- CreateIndex
CREATE INDEX `Subscription_userId_idx` ON `Subscription`(`userId`);

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discountedPrice" DOUBLE PRECISION,
ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false;

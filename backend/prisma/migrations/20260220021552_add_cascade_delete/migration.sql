-- DropForeignKey
ALTER TABLE "AddressSnapshot" DROP CONSTRAINT "AddressSnapshot_orderId_fkey";

-- AddForeignKey
ALTER TABLE "AddressSnapshot" ADD CONSTRAINT "AddressSnapshot_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

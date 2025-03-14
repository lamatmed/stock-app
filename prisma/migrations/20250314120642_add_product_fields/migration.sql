/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expirationDate` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "expirationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Product_code_key" ON "Product"("code");

/*
  Warnings:

  - The primary key for the `ArticleImageLink` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProductImageLink` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `ArticleImageLink` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `ProductImageLink` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "ArticleImageLink" DROP CONSTRAINT "ArticleImageLink_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ArticleImageLink_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProductImageLink" DROP CONSTRAINT "ProductImageLink_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ProductImageLink_pkey" PRIMARY KEY ("id");

/*
  Warnings:

  - Added the required column `contribuicaoIlum` to the `Fatura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fatura" ADD COLUMN     "contribuicaoIlum" DOUBLE PRECISION NOT NULL;

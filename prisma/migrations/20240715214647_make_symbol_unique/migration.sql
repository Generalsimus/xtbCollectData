/*
  Warnings:

  - A unique constraint covering the columns `[symbol]` on the table `Symbol` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Symbol_symbol_key" ON "Symbol"("symbol");

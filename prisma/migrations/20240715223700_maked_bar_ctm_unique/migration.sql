/*
  Warnings:

  - A unique constraint covering the columns `[ctm]` on the table `Bar` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bar_ctm_key" ON "Bar"("ctm");

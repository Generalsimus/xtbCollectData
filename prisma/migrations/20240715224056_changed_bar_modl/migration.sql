/*
  Warnings:

  - Added the required column `period` to the `Bar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `Bar` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "symbol" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "ctm" BIGINT NOT NULL,
    "ctmString" DATETIME NOT NULL,
    "open" REAL NOT NULL,
    "close" REAL NOT NULL,
    "high" REAL NOT NULL,
    "low" REAL NOT NULL,
    "vol" REAL NOT NULL
);
INSERT INTO "new_Bar" ("close", "createdAt", "ctm", "ctmString", "high", "id", "low", "open", "updatedAt", "vol") SELECT "close", "createdAt", "ctm", "ctmString", "high", "id", "low", "open", "updatedAt", "vol" FROM "Bar";
DROP TABLE "Bar";
ALTER TABLE "new_Bar" RENAME TO "Bar";
CREATE UNIQUE INDEX "Bar_symbol_period_ctm_key" ON "Bar"("symbol", "period", "ctm");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

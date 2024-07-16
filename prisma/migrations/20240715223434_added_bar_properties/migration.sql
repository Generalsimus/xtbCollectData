/*
  Warnings:

  - Added the required column `close` to the `Bar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ctm` to the `Bar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ctmString` to the `Bar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `high` to the `Bar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `low` to the `Bar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `open` to the `Bar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vol` to the `Bar` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ctm" BIGINT NOT NULL,
    "ctmString" DATETIME NOT NULL,
    "open" REAL NOT NULL,
    "close" REAL NOT NULL,
    "high" REAL NOT NULL,
    "low" REAL NOT NULL,
    "vol" REAL NOT NULL
);
INSERT INTO "new_Bar" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "Bar";
DROP TABLE "Bar";
ALTER TABLE "new_Bar" RENAME TO "Bar";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

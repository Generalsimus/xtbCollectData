import { sql } from "kysely";
import { xtbConnect } from "../ws-client";
import { db } from "../db/db";
import { Symbol } from "../db/types";

export type GroupedSymbols = {
  categoryName: string;
  symbols: Pick<Symbol, "id" | "symbol">[];
}[];
const getCachedSymbols = async () => {
  const symbols = await sql<GroupedSymbols>`SELECT
    categoryName,
    json_group_array(
        json_object(
            'id', Symbol.id,
            'symbol', Symbol.symbol
        )
    ) AS symbols
FROM
    Symbol
GROUP BY
    categoryName;`.execute(db);
  if (symbols.rows.length === 0) {
    await xtbConnect.getAllSymbols();
    return getCachedSymbols();
  }
  return symbols.rows;
};
export const getSymbols = async () => {
  return getCachedSymbols();
};

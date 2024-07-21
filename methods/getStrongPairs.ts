import { db } from "../db/db";
import { xtbConnect } from "../ws-client";

export const getStrongPairs = async (
  currency: string[],
  period: number,
  hourInterval: number
) => {
  const symbols: string[] = [];
  for (let i = 1; i < currency.length; i++) {
    const currency1 = `${currency[i - 1]}`;
    const currency2 = `${currency[i]}`;
    symbols.push(`${currency1}${currency2}`.toUpperCase());
    symbols.push(`${currency2}${currency1}`.toUpperCase());
  }
  const symbolsDocs = await db
    .selectFrom("Symbol")
    .where("Symbol.symbol", "in", symbols)
    .selectAll()
    .execute();
  console.log("🚀 --> symbolsDocs:", symbolsDocs);
  const symbolsBars = await Promise.all(
    symbolsDocs.map(async (symbolDoc) => {
      return {
        symbol: symbolDoc.symbol,
        period,
        hourInterval,
        bars: await xtbConnect.getCandles(
          symbolDoc.symbol,
          Date.now() - hourInterval * 3600000,
          Date.now(),
          period
        ),
      };
    })
  );

  console.log("🚀 --> symbolsBars:", symbolsBars);
  return { symbolsBars };
};

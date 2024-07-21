import { sql } from "kysely";
import { db } from "../db/db";
import { xtbConnect } from "../ws-client";
import { Bar } from "../db/types";
import { DateAddDays } from "../utils/date";

const contactBars = async () => {
  const res = await Promise.all([
    db
      .updateTable("Bar")
      .from("Bar as lowStart")
      .set((eb) => ({
        startIntervalGroup: eb.ref("lowStart.startIntervalGroup"),
      }))
      .whereRef("lowStart.startIntervalGroup", "<", "Bar.startIntervalGroup")
      .whereRef("lowStart.endIntervalGroup", ">=", "Bar.startIntervalGroup")
      .execute(),
    db
      .updateTable("Bar")
      .from("Bar as hightEnd")
      .set((eb) => ({
        endIntervalGroup: eb.ref("hightEnd.endIntervalGroup"),
      }))
      .whereRef("hightEnd.startIntervalGroup", "<=", "Bar.endIntervalGroup")
      .whereRef("hightEnd.endIntervalGroup", ">", "Bar.endIntervalGroup")
      .execute(),
  ]);
  if (res.flat(2).some((el) => el.numUpdatedRows !== BigInt("0"))) {
    await contactBars();
  }
};

const getBarsFromDb = async (symbol: string, start: number, end: number) => {
  const res = await sql<Bar>`select * from Bar
WHERE (Bar.ctm >= ${start} AND Bar.ctm <= ${end}) AND Bar.symbol = ${symbol}
    ORDER BY Bar.ctm ASC`.execute(db);

  return res.rows;
};
const getBarsFromCacheOrXtbClient = async (
  symbol: string,
  start: number,
  end: number
) => {
  const cachedBars = await getBarsFromDb(symbol, start, end);

  let previousStart = start;
  let maxEnd = 0;
  let awaitBars: Promise<any>[] = [];
  for (const bar of cachedBars) {
    if (previousStart < bar.startIntervalGroup) {
      awaitBars.push(
        xtbConnect.getCandles(symbol, previousStart, bar.startIntervalGroup, 1)
      );
    }
    previousStart = bar.startIntervalGroup;
    maxEnd = Math.max(maxEnd, bar.endIntervalGroup);
  }
  if (cachedBars.length === 0) {
    awaitBars.push(xtbConnect.getCandles(symbol, start, end, 1));
  } else if (maxEnd < end) {
    awaitBars.push(xtbConnect.getCandles(symbol, maxEnd, end, 1));
  }

  if (awaitBars.length !== 0) {
    await Promise.all(awaitBars);
    await contactBars();
    return getBarsFromCacheOrXtbClient(symbol, start, end);
  }
  return cachedBars;
};

export const getCandlesRange = async (
  symbol: string,
  start: number,
  end: number
) => {
  const currentBars = await getBarsFromCacheOrXtbClient(symbol, start, end);

  return currentBars;
};

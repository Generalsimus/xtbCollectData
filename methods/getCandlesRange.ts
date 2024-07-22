import { sql } from "kysely";
import { db } from "../db/db";
import { xtbConnect } from "../ws-client";
import { Bar } from "../db/types";
import { contactDbBars } from "./utils/contactBars";
import { MinutesToMs } from "../utils/date";
import { convertBarToPureBar } from "./utils/convertBarToPureBar";

export type PureBar = Pick<
  Bar,
  | "open"
  | "close"
  | "high"
  | "low"
  | "digits"
  | "startIntervalGroup"
  | "endIntervalGroup"
> & {
  time: number;
  volume: number;
};

const getBarsFromDb = async (
  symbol: string,
  start: number,
  end: number,
  intervalMinutes: number
) => {
  const res = await sql<PureBar>`
select
    MAX(Bar.high) as "high",
    FIRST_VALUE(Bar.open) OVER (ORDER BY Bar.ctm ASC) AS open,
    LAST_VALUE(Bar.close) OVER (ORDER BY Bar.ctm ASC) AS close,
    MIN(Bar.startIntervalGroup) as "startIntervalGroup",
    Max(Bar.endIntervalGroup) as "endIntervalGroup",
    MIN(Bar.low) as "low",
    AVG(Bar.digits) as "digits",
    AVG(Bar.vol) as "volume",
    AVG(Bar.ctm) as "time"
    from Bar
WHERE (Bar.ctm >= ${start} AND Bar.ctm <= ${end}) AND Bar.symbol = ${symbol}
GROUP BY round(Bar.ctm / ${MinutesToMs(intervalMinutes)})
ORDER BY Bar.ctm ASC;`.execute(db);

  return res.rows;
};
const getBarsFromCacheOrXtbClient = async (
  symbol: string,
  start: number,
  end: number,
  intervalMinutes: number
) => {
  const cachedBars = await getBarsFromDb(symbol, start, end, 1);

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
    await contactDbBars();
    return getBarsFromDb(symbol, start, end, intervalMinutes);
  }
  return cachedBars;
};

export const getCandlesRange = async (
  symbol: string,
  start: number,
  end: number,
  intervalMinutes: number
) => {
  const currentBars = await getBarsFromCacheOrXtbClient(
    symbol,
    start,
    end,
    intervalMinutes
  );

  return currentBars.map(convertBarToPureBar);
};

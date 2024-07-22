import { PureBar } from "../getCandlesRange";

export const concatBarInterval = (bars: PureBar[]): PureBar => {
  let open = 0;
  let close = 0;
  let high = -Infinity;
  let low = Infinity;
  let minTime = Infinity;
  let maxTime = -Infinity;
  let volume = 0;
  for (const bar of bars) {
    if (minTime > bar.time) {
      minTime = bar.time;
      open = bar.open;
    }
    if (maxTime < bar.time) {
      maxTime = bar.time;
      close = bar.close;
    }
    high = Math.max(high, bar.high);
    low = Math.min(low, bar.low);
  }
  return {
    open,
    close,
    high,
    low,
    time: minTime / 2 + maxTime / 2,
    volume,
  };
};

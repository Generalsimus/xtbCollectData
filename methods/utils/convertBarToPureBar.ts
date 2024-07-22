import { Bar } from "../../db/types";
import { PureBar } from "../getCandlesRange";

export const convertBarToPureBar = (bar: PureBar): PureBar => {
  const factor = Math.pow(10, bar.digits);
  const openPrice = bar.open / factor;
  return {
    startIntervalGroup: bar.startIntervalGroup,
    endIntervalGroup: bar.endIntervalGroup,
    digits: bar.digits,
    open: openPrice,
    close: openPrice + bar.close / factor,
    high: openPrice + bar.high / factor,
    low: openPrice + bar.low / factor,
    time: bar.time,
    volume: bar.volume,
  };
};

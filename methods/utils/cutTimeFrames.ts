import { Bar } from "../../db/types";
import { MinutesToMs } from "../../utils/date";
import { PureBar } from "../getCandlesRange";
import { concatBarInterval } from "./concatBarInterval";
import { convertBarToPureBar } from "./convertBarToPureBar";

// export const cutTimeFrames = (bars: Bar[], intervalMinutes: number): PureBar[] => {
//     if (intervalMinutes === 1) {
//       return bars.map(convertBarToPureBar);
//     }
//     const intervalToMs = MinutesToMs(intervalMinutes);
//     const cutBars: PureBar[] = [];
//     let intervalBars: PureBar[] = [];
//     let previousStart = 0;
//     for (const bar of bars) {
//       if (bar.ctm - previousStart >= intervalToMs) {
//         if (intervalBars.length !== 0) {
//           cutBars.push(concatBarInterval(intervalBars));
//         }
//         intervalBars = [];
//         previousStart = bar.ctm;
//       }
//       intervalBars.push(convertBarToPureBar(bar));
//     }
//     return cutBars;
//   };
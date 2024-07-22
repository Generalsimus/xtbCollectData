import { getCandlesRange } from "./methods/getCandlesRange";
import { getStrongPairs } from "./methods/getStrongPairs";
import { getSymbols } from "./methods/getSymbols";

export const wsMethods = {
  getStrongPairs: getStrongPairs,
  getSymbols: getSymbols,
  getCandlesRange: getCandlesRange,
};

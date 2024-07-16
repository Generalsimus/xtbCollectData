import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Bar = {
    id: Generated<number>;
    createdAt: Generated<string>;
    updatedAt: string;
    symbol: string;
    period: number;
    ctm: number;
    ctmString: string;
    open: number;
    close: number;
    high: number;
    low: number;
    vol: number;
};
export type Symbol = {
    id: Generated<number>;
    createdAt: Generated<string>;
    updatedAt: string;
    symbol: string;
    currency: string;
    categoryName: string;
    currencyProfit: string;
};
export type DB = {
    Bar: Bar;
    Symbol: Symbol;
};

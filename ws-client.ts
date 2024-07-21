import WebSocket from "ws";
import { Bar, Symbol } from "./db/types";
import { db } from "./db/db";

type Message<Data extends any = any> = {
  status: boolean;
  customTag: string;
} & Data;
type ChainFn = (message: Message) => void;

class wsClient {
  streamSessionId?: string;
  wsUrl: string;
  userId: string;
  password: string;
  ws: Promise<WebSocket>;
  messagesChain = new Map<string, ChainFn>();
  constructor(wsUrl: string, userId: string, password: string) {
    this.wsUrl = wsUrl;
    this.userId = userId;
    this.password = password;
    this.ws = this.connect();
    this.keepAlive();
  }
  connect() {
    const ws = new WebSocket(this.wsUrl);

    return new Promise<WebSocket>((resolve, reject) => {
      ws.on("error", reject);
      ws.on("close", () => {
        console.log("disconnected");
        reject("disconnected");
      });

      ws.on("open", () => {
        resolve(ws);
      });
      ws.on("message", (data) => {
        const message: Message = JSON.parse(data.toString());
        // console.log(`message: `, message);
        const call = this.messagesChain.get(message.customTag);
        if (call) {
          call(message);
          this.messagesChain.delete(message.customTag);
        }
      });
    });
  }
  async send<RET extends any>(data: object): Promise<RET> {
    const tag = `CUSTOM_TAG_${Math.random()}_${Date.now()}`;
    const ws = await this.ws;
    return new Promise((resolve) => {
      this.messagesChain.set(tag, (message) => {
        resolve(message);
      });
      ws.send(JSON.stringify({ ...data, customTag: tag }));
    });
  }
  async login() {
    if (this.streamSessionId) {
      return this.streamSessionId;
    }
    const result = await this.send<{ streamSessionId: string }>({
      command: "login",
      arguments: {
        userId: this.userId,
        password: this.password,
      },
    });

    this.streamSessionId = result.streamSessionId;
    return this.streamSessionId;
  }
  async keepAlive() {
    setInterval(async () => {
      this.send({
        command: "ping",
      });
    }, 3000);
  }
  async getAllSymbols() {
    const data = {
      command: "getAllSymbols",
    };

    const result = await this.send<{
      status: true;
      returnData: Omit<Symbol, "id" | "createdAt" | "updatedAt">[];
    }>(data);

    await this.saveSymbolsInDb(result.returnData);
    return result.returnData;
  }
  async saveSymbolsInDb(
    symbols: Omit<Symbol, "id" | "createdAt" | "updatedAt">[]
  ) {
    return await db
      .insertInto("Symbol")
      .values(
        symbols.map((symbol) => {
          return {
            symbol: symbol.symbol,
            currencyProfit: symbol.currencyProfit,
            currency: symbol.currency,
            categoryName: symbol.categoryName,
            updatedAt: new Date().toString(),
          } as const;
        })
      )
      .onConflict((oc) => oc.column("symbol").doNothing())
      .execute();
  }
  async getCandles(
    symbol: string,
    start: number,
    end: number,
    period: number
  ): Promise<Omit<Bar, "id" | "createdAt" | "updatedAt">[]> {
    const data = {
      command: "getChartRangeRequest",
      arguments: {
        info: {
          period: period,
          start: start - 2000,
          end: end + 2000,
          symbol: symbol,
        },
      },
    };
    const result = await this.send<{
      returnData: {
        rateInfos: Omit<
          Bar,
          | "id"
          | "createdAt"
          | "updatedAt"
          | "period"
          | "start"
          | "symbol"
          | "startIntervalGroup"
          | "endIntervalGroup"
        >[];
      };
    }>(data);
    const resBars = result.returnData.rateInfos;
    if (resBars.length) {
      console.log("🚀 --> wsClient --> result DT:", {
        "resBars.length": resBars.length,
        ctm1: new Date(resBars[0].ctm),
        ctm2: new Date(resBars[resBars.length - 1].ctm),
        start: new Date(start),
        end: new Date(end),
      });
    }
    const bars = resBars.map((el) => {
      return {
        period: period,
        symbol: symbol,
        startIntervalGroup: start,
        endIntervalGroup: end,
        ...el,
      };
    });
    await this.saveBarsInDb(bars);
    return bars;
  }
  async getCandlesLastRequest(
    symbol: string,
    start: number,
    period: number
  ): Promise<Omit<Bar, "id" | "createdAt" | "updatedAt">[]> {
    const data = {
      command: "getChartLastRequest",
      arguments: {
        info: {
          period: period,
          start: start,
          symbol: symbol,
        },
      },
    };
    const result = await this.send<{
      returnData: {
        rateInfos: Omit<
          Bar,
          | "id"
          | "createdAt"
          | "updatedAt"
          | "period"
          | "start"
          | "symbol"
          | "startIntervalGroup"
          | "endIntervalGroup"
        >[];
      };
    }>(data);
    const resBars = result.returnData.rateInfos;
    const firsBar = resBars[0];
    const lastBar = resBars[resBars.length - 1];
    const bars = resBars.map((el) => {
      return {
        period: period,
        symbol: symbol,
        startIntervalGroup: firsBar.ctm,
        endIntervalGroup: lastBar.ctm,
        ...el,
      };
    });
    await this.saveBarsInDb(bars);
    return bars;
  }
  async saveBarsInDb(bars: Omit<Bar, "id" | "createdAt" | "updatedAt">[]) {
    if (bars.length === 0) {
      return [];
    }

    const chunkSize = 2000;
    for (let i = 0; i < bars.length; i += chunkSize) {
      const chunk = bars.slice(i, i + chunkSize);
      await db
        .insertInto("Bar")
        .values(
          chunk.map((bar) => {
            return {
              period: bar.period,
              startIntervalGroup: bar.startIntervalGroup,
              endIntervalGroup: bar.endIntervalGroup,
              symbol: bar.symbol,
              ctm: bar.ctm,
              ctmString: bar.ctmString,
              open: bar.open,
              close: bar.close,
              high: bar.high,
              low: bar.low,
              vol: bar.vol,
              updatedAt: new Date().toString(),
            } as const;
          })
        )
        .onConflict((oc) => oc.columns(["symbol", "period", "ctm"]).doNothing())
        .execute();
    }
  }
}

export const xtbConnect = new wsClient(
  `${process.env.WS_URL}`,
  `${process.env.USER_ID}`,
  `${process.env.PASSWORD}`
);
xtbConnect.login().then(() => xtbConnect.keepAlive());

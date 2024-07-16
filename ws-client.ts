import WebSocket from "ws";
import { Bar, Symbol } from "./db/types";
import { db } from "./db/db";

type Message<Data extends any = any> = {
  status: boolean;
  customTag: string;
} & Data;
type ChainFn = (message: Message) => void;

export class wsClient {
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
        console.log(`message: `, message);
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
    const result = await this.send(data);

    return result;
  }
  async getCandles(
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
          "id" | "createdAt" | "updatedAt" | "period" | "start" | "symbol"
        >[];
      };
    }>(data);
    return result.returnData.rateInfos.map((el) => {
      return {
        period: period,
        symbol: symbol,
        ...el,
      };
    });
  }
  async saveBarsInDb(bars: Omit<Bar, "id" | "createdAt" | "updatedAt">[]) {
    return await db
      .insertInto("Bar")
      .values(
        bars.map((bar) => {
          return {
            period: bar.period,
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

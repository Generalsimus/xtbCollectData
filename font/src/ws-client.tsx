// export class WsClient {
//     constructor(){

//     }
// }

// import WebSocket from "ws";
// import { Bar, Symbol } from "./db/types";
// import { db } from "./db/db";

type Message<Data extends any = any> = {
  tag: string;
  returnValue: Data;
};
type ChainFn = (message: Message) => void;

class WsClient {
  streamSessionId?: string;
  wsUrl: string;
  ws: Promise<WebSocket>;
  messagesChain = new Map<string, ChainFn>();
  constructor(wsUrl: string) {
    this.wsUrl = wsUrl;
    this.ws = this.connect();
  }
  connect() {
    const socket = new WebSocket(this.wsUrl);

    return new Promise<WebSocket>((resolve, reject) => {
      socket.addEventListener("error", () => {
        resolve(this.connect());
      });
      socket.addEventListener("close", () => {
        console.log("disconnected");
      });

      socket.addEventListener("open", (event) => {
        console.log("connected successful.");
        resolve(socket);
      });

      socket.addEventListener("message", (event) => {
        const message: Message = JSON.parse(event.data);
        const call = this.messagesChain.get(message.tag);
        if (call) {
          call(message);
          this.messagesChain.delete(message.tag);
        }
      });
    });
  }
  async send<RET extends any>(method: string, ...args: any[]): Promise<RET> {
    const tag = `CUSTOM_TAG_${Math.random()}_${Date.now()}`;
    const ws = await this.ws;
    return new Promise((resolve) => {
      this.messagesChain.set(tag, (message) => {
        console.log(
          "🚀 --> WsClient --> this.messagesChain.set --> message:",
          message
        );
        resolve(message.returnValue);
      });
      ws.send(JSON.stringify({ args, tag, method }));
    });
  }
}
export const wsClient = new WsClient("ws://localhost:2222");

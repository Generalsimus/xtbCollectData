import WebSocket, { WebSocketServer } from "ws";
import { wsMethods } from "./ws-methods";

export const wsServer = new WebSocketServer({
  port: 2222,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  },
});

wsServer.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data) => {
    const message: {
      tag: string;
      args: any[];
      method: keyof typeof wsMethods;
    } = JSON.parse(data.toString());
    const returnValue = (wsMethods?.[message.method] as any)?.(...message.args);

    ws.send(JSON.stringify({ tag: message.tag, returnValue }));
  });
});

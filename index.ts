import { db } from "./db/db";
import { wsClient } from "./ws-client";
import "dotenv/config";
import { wsServer } from "./ws-server";

console.log("wsPort:", wsServer.options.port);
// (async () => {
//   const xtbConnect = new wsClient(
//     `${process.env.WS_URL}`,
//     `${process.env.USER_ID}`,
//     `${process.env.PASSWORD}`
//   );
//   await xtbConnect.login();
//   await xtbConnect.keepAlive();
//   const bars = await xtbConnect.getCandles(
//     "EURUSD",
//     Date.now() - 60 * 60 * 1000,
//     1
//   );
//   console.log("🚀 --> bars:", bars);
//   await xtbConnect.saveBarsInDb(bars);
// })();

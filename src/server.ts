import { createApp } from "./app";
import http from "http";
import { initWsServer } from "./webSocket/wsServer";

export function createServer() {
  const app = createApp();
  const server = http.createServer(app);

  initWsServer(server);

  server.listen(3000, () => {
    console.log("run createServer");
  });
}

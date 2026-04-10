import console from "console";
import { Server } from "http";
import { WebSocketServer } from "ws";
import { response } from "./wsRespons";
import { lobbyManager } from "../game/lobbymanager";
import { generateId } from "../util/idGenerate";

export let wss: WebSocketServer;

export function initWsServer(server: Server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws: any, req) => {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const lobbyId = url.searchParams.get("lobbyId");
    const playerId = generateId();

    ws.playerId = playerId;

    if (lobbyId) {
      const lobby = lobbyManager.getLobby(lobbyId);
      if (lobby) {
        ws.lobbyId = lobby.id;
        lobby.addPlayer(playerId, ws);
      }
    }

    ws.on("message", (message: any) => {
      try {
        const data = JSON.parse(message);
        if (data.type && response[data.type]) {
          response[data.type](ws, data);
        }
      } catch (e) {
        console.error("Ошибка в месседже");
      }
    });

    ws.on("close", () => {
      if (ws.lobbyId) {
        const lobby = lobbyManager.getLobby(ws.lobbyId);
        lobby?.removePlayer(playerId);

        if (lobby && lobby.players.size === 0) {
          lobbyManager.removeLobby(ws.lobbyId);
        }
      }
    });
  });
}

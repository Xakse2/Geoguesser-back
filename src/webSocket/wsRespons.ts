import { WebSocket } from "ws";
import { lobbyManager } from "../game/lobbymanager";
import { json } from "node:stream/consumers";
import { GuessPayload } from "../util/interface";

export const response: Record<string, (ws: any, payload?: any) => void> = {
  createLobby: (ws) => {
    const newLobby = lobbyManager.createLobby();

    ws.lobbyId = newLobby.id;

    newLobby.addPlayer(ws.playerId, ws);

    ws.send(
      JSON.stringify({
        type: "LOBBY_CREATED",
        payload: { lobbyId: newLobby.id },
      })
    );
  },

  startRound: (ws) => {
    const lobby = lobbyManager.getLobby(ws.lobbyId);
    lobby?.startRound();
  },
  checkGuess: (ws, payload) => {
    const lobby = lobbyManager.getLobby(ws.lobbyId);
    lobby?.handlePlayerGuess(ws.playerId, payload);
    const testRespons = "guessSubmit";
    ws.send(
      JSON.stringify({
        type: "GUESS_SUCKSESS",
        payload: testRespons,
      })
    );
  },
};

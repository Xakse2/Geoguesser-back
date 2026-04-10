import { Lobby } from "./lobby";

class LobbyManager {
  private lobbies = new Map<string, Lobby>();

  public createLobby(id?: string): Lobby {
    const newLobby = new Lobby();
    this.lobbies.set(newLobby.id, newLobby);
    return newLobby;
  }

  public removeLobby(id: string) {
    this.lobbies.delete(id);
  }

  public getLobby(lobbyId: string): Lobby | undefined {
    return this.lobbies.get(lobbyId);
  }
}

export const lobbyManager = new LobbyManager();

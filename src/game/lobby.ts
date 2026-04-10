import { checkDistans } from "../util/checkDistans";
import { generateId } from "../util/idGenerate";
import { ImageItem } from "../util/imageType";
import { GuessPayload } from "../util/interface";
import { Round } from "./round";
import { getRandomImage } from "./startGame";

export type GameStatus = "waiting" | "playing" | "results";

type player = {
  id: string;
  socket: WebSocket;
  score: number;
};

export class Lobby {
  public currentRound: Round | null = null;
  public readonly id: string;
  public players: Map<string, player>;
  public status: GameStatus = "waiting";
  public currentImage: ImageItem | null = null;
  public currentImageId: string = "";

  constructor() {
    this.id = generateId();
    this.players = new Map();
  }

  public startRound() {
    this.currentImage = getRandomImage();
    if (this.currentImage) {
      this.currentImageId = this.currentImage.id;
    }
    this.currentRound = new Round(30, this.currentImageId);
    this.status = "playing";

    this.alert({
      type: "ROUND_STARTED",
      payload: { pointId: this.currentImageId, duration: 30 },
    });
  }

  public handlePlayerGuess(playerId: string, guess: GuessPayload) {
    if (!this.currentRound || this.status !== "playing") {
      return;
    }

    const point = checkDistans(guess, this.currentImageId);

    const player = this.players.get(playerId);
    if (player && point.points) {
      player.score += point.points;
    }

    this.currentRound.addGuess(playerId, guess);

    if (this.currentRound.guesses.size === this.players.size) {
      this.finishRound();
    }
  }

  public addPlayer(id: string, socket: WebSocket) {
    this.players.set(id, {
      id,
      socket,
      score: 0,
    });
  }

  public removePlayer(id: string) {
    this.players.delete(id);
  }

  public alert(message: any) {
    const messageWithId = {
      ...message,
      payload: {
        ...message.payload,
        lobbyId: this.id,
      },
    };

    const data = JSON.stringify(messageWithId);

    this.players.forEach((player) => {
      if (player.socket.readyState === 1) {
        player.socket.send(data);
      }
    });
  }

  private finishRound() {
    this.status = "results";

    this.alert({
      type: "ROUND_FINISHED",
      payload: {
        guesses: Array.from(this.currentRound!.guesses.entries()),
        leaderboard: Array.from(this.players.values()).map((p) => ({
          id: p.id,
          score: p.score,
        })),
      },
    });
  }
}

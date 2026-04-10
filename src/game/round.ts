import { GuessPayload } from "../util/interface";

export class Round {
  public readonly pointId: string;
  public readonly startTime: number = Date.now();
  public readonly duration: number;
  public guesses = new Map<string, GuessPayload>();

  constructor(duration: number, pointId: string) {
    this.duration = duration;
    this.pointId = pointId;
  }

  public addGuess(playerId: string, guess: GuessPayload) {
    this.guesses.set(playerId, guess);
  }
}

export interface GuessPayload {
  type: "checkGuess";
  imageId: string;
  lat: number;
  lng: number;
}

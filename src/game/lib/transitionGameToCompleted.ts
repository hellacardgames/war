import type { CompletedGame, StartedGame } from "../types/Game.js";

export function transitionGameToCompleted(
  game: StartedGame,
  gameWinnerUsername: string,
): CompletedGame {
  return { ...game, status: "completed", gameWinnerUsername };
}

import type { Game } from "../types/Game.js";
import type { Player } from "../types/Player.js";

export function requirePlayerTwo(game: Game): Player {
  const playerTwo = game.players[1];
  if (!playerTwo) {
    throw new Error("Player two not found.");
  }

  return playerTwo;
}

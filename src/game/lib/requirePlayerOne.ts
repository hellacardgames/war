import type { Game } from "../types/Game.js";
import type { Player } from "../types/Player.js";

export function requirePlayerOne(game: Game): Player {
  const playerOne = game.players[0];
  if (!playerOne) {
    throw new Error("Player one not found.");
  }

  return playerOne;
}

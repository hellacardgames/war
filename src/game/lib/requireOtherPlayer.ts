import type { Game } from "../types/Game.js";
import type { Player } from "../types/Player.js";

export function requireOtherPlayer(game: Game, player: Player): Player {
  const otherPlayer = game.players.find((p) => p.id !== player.id);
  if (!otherPlayer) {
    throw new Error("Other player not found.");
  }

  return otherPlayer;
}

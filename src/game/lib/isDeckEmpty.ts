import type { Player } from "../types/Player.js";

export function isDeckEmpty(player: Player): boolean {
  return player.deck.length === 0;
}

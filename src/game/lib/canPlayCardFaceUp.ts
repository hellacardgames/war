import type { Player } from "../types/Player.js";

export function canPlayCardFaceUp(player: Player): boolean {
  if (player.battlePile.length % 2 !== 0) {
    return false;
  }
  return true;
}

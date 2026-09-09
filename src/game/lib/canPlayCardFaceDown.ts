import { peekLastItemInCollection } from "@hellacardgames/lib";
import type { Player } from "../types/Player.js";

export function canPlayCardFaceDown(
  player: Player,
  otherPlayer: Player,
): boolean {
  if (player.battlePile.length % 2 !== 1) {
    return false;
  }
  const playerCard = peekLastItemInCollection(player.battlePile);
  const otherPlayerCard = otherPlayer.battlePile[player.battlePile.length - 1];
  if (!otherPlayerCard || playerCard.rank !== otherPlayerCard.rank) {
    return false;
  }
  return true;
}

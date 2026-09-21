import {
  getLastIndex,
  isLengthEven,
  peekLastItem,
  tryPeekItem,
} from "@hellacardgames/lib";
import type { Player } from "../types/Player.js";

export function canPlayCardFaceDown(
  player: Player,
  otherPlayer: Player,
): boolean {
  if (isLengthEven(player.battlePile)) {
    return false;
  }

  const playerCard = peekLastItem(player.battlePile);
  const otherPlayerCard = tryPeekItem(
    otherPlayer.battlePile,
    getLastIndex(player.battlePile),
  );

  if (!otherPlayerCard || playerCard.rank !== otherPlayerCard.rank) {
    return false;
  }

  return true;
}

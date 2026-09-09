import {
  getLastIndexInCollection,
  isCollectionLengthEven,
  peekLastItemInCollection,
  tryPeekItemInCollection,
} from "@hellacardgames/lib";
import type { Player } from "../types/Player.js";

export function canPlayCardFaceDown(
  player: Player,
  otherPlayer: Player,
): boolean {
  if (isCollectionLengthEven(player.battlePile)) {
    return false;
  }

  const playerCard = peekLastItemInCollection(player.battlePile);
  const otherPlayerCard = tryPeekItemInCollection(
    otherPlayer.battlePile,
    getLastIndexInCollection(player.battlePile),
  );

  if (!otherPlayerCard || playerCard.rank !== otherPlayerCard.rank) {
    return false;
  }

  return true;
}

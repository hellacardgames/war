import { isCollectionLengthEven } from "@hellacardgames/lib";
import type { Player } from "../types/Player.js";

export function canPlayCardFaceUp(player: Player): boolean {
  return isCollectionLengthEven(player.battlePile);
}

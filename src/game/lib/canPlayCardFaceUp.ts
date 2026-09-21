import { isLengthEven } from "@hellacardgames/lib";
import type { Player } from "../types/Player.js";

export function canPlayCardFaceUp(player: Player): boolean {
  return isLengthEven(player.battlePile);
}

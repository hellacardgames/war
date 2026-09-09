import { canPlayCardFaceDown } from "./canPlayCardFaceDown.js";
import { canPlayCardFaceUp } from "./canPlayCardFaceUp.js";
import type { Player } from "../types/Player.js";

export function canPlayCard(player: Player, otherPlayer: Player): boolean {
  return canPlayCardFaceDown(player, otherPlayer) || canPlayCardFaceUp(player);
}

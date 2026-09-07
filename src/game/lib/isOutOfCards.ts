import { isCapturePileEmpty } from "./isCapturePileEmpty.js";
import { isDeckEmpty } from "./isDeckEmpty.js";
import type { Player } from "../types/Player.js";

export function isOutOfCards(player: Player): boolean {
  return isDeckEmpty(player) && isCapturePileEmpty(player);
}

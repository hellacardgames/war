import { isEmpty } from "@hellacardgames/lib";
import type { Player } from "../types/Player.js";

export function isCapturePileEmpty(player: Player): boolean {
  return isEmpty(player.capturePile);
}

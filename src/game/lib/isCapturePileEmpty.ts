import type { Player } from "../types/Player.js";

export function isCapturePileEmpty(player: Player): boolean {
  return player.capturePile.length === 0;
}

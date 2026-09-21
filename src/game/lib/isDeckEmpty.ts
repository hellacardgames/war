import { isEmpty } from "@hellacardgames/lib";
import type { Player } from "../types/Player.js";

export function isDeckEmpty(player: Player): boolean {
  return isEmpty(player.deck);
}

import { isCollectionEmpty } from "@hellacardgames/lib";
import type { Player } from "../types/Player.js";

export function isDeckEmpty(player: Player): boolean {
  return isCollectionEmpty(player.deck);
}

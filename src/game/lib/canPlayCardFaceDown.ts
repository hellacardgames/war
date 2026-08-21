import type { Game } from "../types/Game.js";
import type { Player } from "../types/Player.js";

export function canPlayCardFaceDown(player: Player, game: Game): boolean {
  if (player.battlePile.length % 2 !== 1) {
    return false;
  }
  const playerCard = player.battlePile[player.battlePile.length - 1]!;
  const otherPlayer = game.players.find((p) => p !== player)!;
  const otherPlayerCard = otherPlayer.battlePile[player.battlePile.length - 1];
  if (!otherPlayerCard || playerCard.rank !== otherPlayerCard.rank) {
    return false;
  }
  return true;
}

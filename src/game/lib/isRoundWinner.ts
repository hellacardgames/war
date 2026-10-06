import {
  getAceHighRankValue,
  getOtherPlayer,
  getPlayer,
  isLengthEven,
  peekLastItem,
} from "@hellacardgames/lib";
import { isOutOfCards } from "./isOutOfCards.js";
import type { StartedGame } from "../types/Game.js";

export function isRoundWinner(game: StartedGame, playerId: string): boolean {
  const { player } = getPlayer(game, playerId);
  if (isLengthEven(player.battlePile)) {
    return false;
  }
  const { otherPlayer } = getOtherPlayer(game, player.id);
  if (player.battlePile.length < otherPlayer.battlePile.length) {
    return false;
  }
  if (
    player.battlePile.length > otherPlayer.battlePile.length &&
    !isOutOfCards(otherPlayer)
  ) {
    return false;
  }
  if (player.battlePile.length === otherPlayer.battlePile.length) {
    const playerCard = peekLastItem(player.battlePile);
    const otherPlayerCard = peekLastItem(otherPlayer.battlePile);
    const playerRankValue = getAceHighRankValue(playerCard.rank);
    const otherPlayerRankValue = getAceHighRankValue(otherPlayerCard.rank);
    if (playerRankValue < otherPlayerRankValue) {
      return false;
    }
    if (
      playerRankValue === otherPlayerRankValue &&
      !isOutOfCards(otherPlayer)
    ) {
      return false;
    }
  }
  return true;
}

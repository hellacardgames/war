import { emitEvent } from "../../lib/emitEvent.js";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { games } from "../games.js";
import type { Game } from "../types/Game.js";

type CollectCardsResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error:
        "gameNotFound" | "playerNotFound" | "invalidStatus" | "invalidMove";
    };

export function collectCards(
  gameId: string,
  playerId: string,
): CollectCardsResult {
  const game = games.get(gameId);
  if (!game) {
    return { success: false, error: "gameNotFound" };
  }
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" };
  }
  if (game.status !== "started") {
    return { success: false, error: "invalidStatus" };
  }
  if (player.battlePile.length % 2 !== 1) {
    return { success: false, error: "invalidMove" };
  }
  const otherPlayer = game.players.find((p) => p !== player)!;
  if (player.battlePile.length < otherPlayer.battlePile.length) {
    return { success: false, error: "invalidMove" };
  }
  if (
    player.battlePile.length > otherPlayer.battlePile.length &&
    (otherPlayer.deck.length > 0 || otherPlayer.capturePile.length > 0)
  ) {
    return { success: false, error: "invalidMove" };
  }
  if (player.battlePile.length === otherPlayer.battlePile.length) {
    const playerCard = player.battlePile[player.battlePile.length - 1]!;
    const otherPlayerCard =
      otherPlayer.battlePile[otherPlayer.battlePile.length - 1]!;
    if (playerCard.rank < otherPlayerCard.rank) {
      return { success: false, error: "invalidMove" };
    }
    if (
      playerCard.rank === otherPlayerCard.rank &&
      (otherPlayer.deck.length > 0 || otherPlayer.capturePile.length > 0)
    ) {
      return { success: false, error: "invalidMove" };
    }
  }
  game.expiresAt = Date.now() + EXPIRY_EXTENSION_MS;
  emitEvent(game, { type: "expirationUpdated", expiresAt: game.expiresAt });
  const collectedCards = [...otherPlayer.battlePile, ...player.battlePile];
  player.capturePile.push(...collectedCards);
  otherPlayer.battlePile.length = 0;
  player.battlePile.length = 0;
  emitEvent(game, {
    type: "cardsCollected",
    username: player.username,
    numCards: collectedCards.length,
  });
  if (otherPlayer.deck.length === 0 && otherPlayer.capturePile.length === 0) {
    emitEvent(game, { type: "gameCompleted" });
    const completedGame: Game = {
      ...game,
      status: "completed",
    };
    games.set(game.id, completedGame);
  }
  return { success: true };
}

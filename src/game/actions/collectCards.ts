import {
  emitEvent,
  emitEventToOtherPlayer,
  emitEventToPlayer,
  getOtherPlayer,
  getRankValue,
  isCollectionLengthEven,
  peekLastItemInCollection,
  tryGetPlayer,
  updatePlayer,
} from "@hellacardgames/lib";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { isOutOfCards } from "../lib/isOutOfCards.js";
import { transitionGameToCompleted } from "../lib/transitionGameToCompleted.js";
import type { Game } from "../types/Game.js";

export function collectCards(game: Game, playerId: string) {
  const { player } = tryGetPlayer(game, playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  if (game.status !== "started") {
    return { success: false, error: "invalidStatus" } as const;
  }
  if (isCollectionLengthEven(player.battlePile)) {
    return { success: false, error: "invalidMove" } as const;
  }
  const { otherPlayer } = getOtherPlayer(game, player.id);
  if (player.battlePile.length < otherPlayer.battlePile.length) {
    return { success: false, error: "invalidMove" } as const;
  }
  if (
    player.battlePile.length > otherPlayer.battlePile.length &&
    !isOutOfCards(otherPlayer)
  ) {
    return { success: false, error: "invalidMove" } as const;
  }
  if (player.battlePile.length === otherPlayer.battlePile.length) {
    const playerCard = peekLastItemInCollection(player.battlePile);
    const otherPlayerCard = peekLastItemInCollection(otherPlayer.battlePile);
    const playerRankValue = getRankValue(playerCard.rank);
    const otherPlayerRankValue = getRankValue(otherPlayerCard.rank);
    if (playerRankValue < otherPlayerRankValue) {
      return { success: false, error: "invalidMove" } as const;
    }
    if (
      playerRankValue === otherPlayerRankValue &&
      !isOutOfCards(otherPlayer)
    ) {
      return { success: false, error: "invalidMove" } as const;
    }
  }

  const collectedCards = [...otherPlayer.battlePile, ...player.battlePile];

  game = updatePlayer(game, player.id, (p) => ({
    ...p,
    capturePile: [...p.capturePile, ...collectedCards],
    battlePile: [],
  }));

  game = updatePlayer(game, otherPlayer.id, (p) => ({
    ...p,
    battlePile: [],
  }));

  game = emitEventToPlayer(game, player.id, {
    type: "playerCollectedCards",
    numCards: collectedCards.length,
  });
  game = emitEventToOtherPlayer(game, player.id, {
    type: "otherPlayerCollectedCards",
    numCards: collectedCards.length,
  });

  if (isOutOfCards(otherPlayer)) {
    game = transitionGameToCompleted(game);
    game = emitEvent(game, { type: "gameCompleted" });
  }

  game = { ...game, expiresAt: Date.now() + EXPIRY_EXTENSION_MS };
  game = emitEvent(game, {
    type: "expirationUpdated",
    expiresAt: game.expiresAt,
  });

  return { success: true, game } as const;
}

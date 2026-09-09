import { emitEvent, updatePlayer } from "@hellacardgames/lib";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { isOutOfCards } from "../lib/isOutOfCards.js";
import { requireOtherPlayer } from "../lib/requireOtherPlayer.js";
import { transitionGameToCompleted } from "../lib/transitionGameToCompleted.js";
import type { Game } from "../types/Game.js";

export function collectCards(game: Game, playerId: string) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  if (game.status !== "started") {
    return { success: false, error: "invalidStatus" } as const;
  }
  if (player.battlePile.length % 2 !== 1) {
    return { success: false, error: "invalidMove" } as const;
  }
  const otherPlayer = requireOtherPlayer(game, player.id);
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
    const playerCard = player.battlePile[player.battlePile.length - 1]!;
    const otherPlayerCard =
      otherPlayer.battlePile[otherPlayer.battlePile.length - 1]!;
    if (playerCard.rank < otherPlayerCard.rank) {
      return { success: false, error: "invalidMove" } as const;
    }
    if (
      playerCard.rank === otherPlayerCard.rank &&
      !isOutOfCards(otherPlayer)
    ) {
      return { success: false, error: "invalidMove" } as const;
    }
  }

  game = { ...game, expiresAt: Date.now() + EXPIRY_EXTENSION_MS };
  game = emitEvent(game, {
    type: "expirationUpdated",
    expiresAt: game.expiresAt,
  });

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

  game = emitEvent(game, {
    type: "cardsCollected",
    username: player.username,
    numCards: collectedCards.length,
  });

  if (isOutOfCards(otherPlayer)) {
    game = transitionGameToCompleted(game);
    game = emitEvent(game, { type: "gameCompleted" });
  }

  return { success: true, game } as const;
}

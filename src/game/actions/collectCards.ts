import {
  emitEvent,
  emitEventToOtherPlayer,
  emitEventToPlayer,
  getOtherPlayer,
  tryGetPlayer,
  updatePlayer,
} from "@hellacardgames/lib";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { isOutOfCards } from "../lib/isOutOfCards.js";
import { transitionGameToCompleted } from "../lib/transitionGameToCompleted.js";
import { setAvailableActions } from "../lib/setAvailableActions.js";
import type { Game } from "../types/Game.js";

export function collectCards(game: Game, playerId: string) {
  const { player } = tryGetPlayer(game, playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  if (game.status !== "started") {
    return { success: false, error: "invalidStatus" } as const;
  }
  if (!player.roundWinner) {
    return { success: false, error: "invalidMove" } as const;
  }

  const { otherPlayer } = getOtherPlayer(game, player.id);

  const collectedCards = [...otherPlayer.battlePile, ...player.battlePile];

  game = updatePlayer(game, player.id, (p) => ({
    ...p,
    capturePile: [...p.capturePile, ...collectedCards],
    battlePile: [],
    roundWinner: false,
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

  game = setAvailableActions(game);

  if (isOutOfCards(otherPlayer)) {
    game = transitionGameToCompleted(game, player.username);
    game = emitEvent(game, {
      type: "gameCompleted",
      gameWinnerUsername: player.username,
    });
  }

  game = { ...game, expiresAt: Date.now() + EXPIRY_EXTENSION_MS };
  game = emitEvent(game, {
    type: "expirationUpdated",
    expiresAt: game.expiresAt,
  });

  return { success: true, game } as const;
}

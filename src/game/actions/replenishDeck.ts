import {
  emitEvent,
  emitEventToOtherPlayer,
  emitEventToPlayer,
  shuffle,
  tryGetPlayer,
  updatePlayer,
} from "@hellacardgames/lib";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { setAvailableActions } from "../lib/setAvailableActions.js";
import type { Game } from "../types/Game.js";

export function replenishDeck(game: Game, playerId: string) {
  const { player } = tryGetPlayer(game, playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  if (game.status !== "started") {
    return { success: false, error: "invalidStatus" } as const;
  }
  if (!player.canReplenishDeck) {
    return { success: false, error: "invalidMove" } as const;
  }

  const newDeck = shuffle(player.capturePile);
  game = updatePlayer(game, player.id, (p) => ({
    ...p,
    deck: newDeck,
    capturePile: [],
  }));

  game = emitEventToPlayer(game, player.id, {
    type: "playerDeckReplenished",
    numCards: newDeck.length,
  });
  game = emitEventToOtherPlayer(game, player.id, {
    type: "otherPlayerDeckReplenished",
    numCards: newDeck.length,
  });

  game = setAvailableActions(game);

  game = { ...game, expiresAt: Date.now() + EXPIRY_EXTENSION_MS };
  game = emitEvent(game, {
    type: "expirationUpdated",
    expiresAt: game.expiresAt,
  });

  return { success: true, game } as const;
}

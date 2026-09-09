import {
  emitEvent,
  requireOtherPlayer,
  shuffle,
  updatePlayer,
} from "@hellacardgames/lib";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { canPlayCard } from "../lib/canPlayCard.js";
import { isCapturePileEmpty } from "../lib/isCapturePileEmpty.js";
import { isDeckEmpty } from "../lib/isDeckEmpty.js";
import type { Game } from "../types/Game.js";

export function replenishDeck(game: Game, playerId: string) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  if (game.status !== "started") {
    return { success: false, error: "invalidStatus" } as const;
  }
  const { otherPlayer } = requireOtherPlayer(game, player.id);
  if (!canPlayCard(player, otherPlayer)) {
    return { success: false, error: "invalidMove" } as const;
  }
  if (!isDeckEmpty(player)) {
    return { success: false, error: "deckNotEmpty" } as const;
  }
  if (isCapturePileEmpty(player)) {
    return { success: false, error: "capturePileEmpty" } as const;
  }

  const newDeck = shuffle(player.capturePile);
  game = updatePlayer(game, player.id, (p) => ({
    ...p,
    deck: newDeck,
    capturePile: [],
  }));

  game = emitEvent(game, {
    type: "deckReplenished",
    username: player.username,
    numCards: newDeck.length,
  });

  game = { ...game, expiresAt: Date.now() + EXPIRY_EXTENSION_MS };
  game = emitEvent(game, {
    type: "expirationUpdated",
    expiresAt: game.expiresAt,
  });

  return { success: true, game } as const;
}

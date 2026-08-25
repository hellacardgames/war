import { emitEvent } from "../lib/emitEvent.js";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { canPlayCardFaceUp } from "../lib/canPlayCardFaceUp.js";
import type { Game } from "../types/Game.js";

export function playCardFaceUp(game: Game, playerId: string) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  if (game.status !== "started") {
    return { success: false, error: "invalidStatus" } as const;
  }
  if (!canPlayCardFaceUp(player)) {
    return { success: false, error: "invalidMove" } as const;
  }
  if (player.deck.length === 0) {
    return { success: false, error: "deckEmpty" } as const;
  }
  game.expiresAt = Date.now() + EXPIRY_EXTENSION_MS;
  emitEvent(game, { type: "expirationUpdated", expiresAt: game.expiresAt });
  const card = player.deck.pop()!;
  player.battlePile.push(card);
  emitEvent(game, { type: "cardPlayed", username: player.username, card });
  return { success: true, game } as const;
}

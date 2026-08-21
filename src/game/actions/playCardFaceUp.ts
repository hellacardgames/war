import { emitEvent } from "../lib/emitEvent.js";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { canPlayCardFaceUp } from "../lib/canPlayCardFaceUp.js";
import type { StartedGame } from "../types/Game.js";

type PlayCardFaceUpResult =
  | {
      readonly success: true;
      readonly game: StartedGame;
    }
  | {
      readonly success: false;
      readonly error: "playerNotFound" | "invalidMove" | "deckEmpty";
    };

export function playCardFaceUp(
  game: StartedGame,
  playerId: string,
): PlayCardFaceUpResult {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" };
  }
  if (!canPlayCardFaceUp(player)) {
    return { success: false, error: "invalidMove" };
  }
  if (player.deck.length === 0) {
    return { success: false, error: "deckEmpty" };
  }
  game.expiresAt = Date.now() + EXPIRY_EXTENSION_MS;
  emitEvent(game, { type: "expirationUpdated", expiresAt: game.expiresAt });
  const card = player.deck.pop()!;
  player.battlePile.push(card);
  emitEvent(game, { type: "cardPlayed", username: player.username, card });
  return { success: true, game };
}

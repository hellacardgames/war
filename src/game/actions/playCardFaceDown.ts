import { emitEvent } from "../lib/emitEvent.js";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { canPlayCardFaceDown } from "../lib/canPlayCardFaceDown.js";
import type { StartedGame } from "../types/Game.js";

type PlayCardFaceDownResult =
  | {
      readonly success: true;
      readonly game: StartedGame;
    }
  | {
      readonly success: false;
      readonly error: "playerNotFound" | "invalidMove" | "deckEmpty";
    };

export function playCardFaceDown(
  game: StartedGame,
  playerId: string,
): PlayCardFaceDownResult {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" };
  }
  if (!canPlayCardFaceDown(player, game)) {
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

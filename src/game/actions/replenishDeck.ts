import { emitEvent } from "../lib/emitEvent.js";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { canPlayCardFaceUp } from "../lib/canPlayCardFaceUp.js";
import { canPlayCardFaceDown } from "../lib/canPlayCardFaceDown.js";
import { shuffleCards } from "../lib/shuffleCards.js";
import type { StartedGame } from "../types/Game.js";

type ReplenishDeckResult =
  | {
      readonly success: true;
      readonly game: StartedGame;
    }
  | {
      readonly success: false;
      readonly error:
        "playerNotFound" | "invalidMove" | "deckNotEmpty" | "capturePileEmpty";
    };

export function replenishDeck(
  game: StartedGame,
  playerId: string,
): ReplenishDeckResult {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" };
  }
  if (!(canPlayCardFaceDown(player, game) || canPlayCardFaceUp(player))) {
    return { success: false, error: "invalidMove" };
  }
  if (player.deck.length > 0) {
    return { success: false, error: "deckNotEmpty" };
  }
  if (player.capturePile.length === 0) {
    return { success: false, error: "capturePileEmpty" };
  }
  game.expiresAt = Date.now() + EXPIRY_EXTENSION_MS;
  emitEvent(game, { type: "expirationUpdated", expiresAt: game.expiresAt });
  player.deck.push(...player.capturePile);
  player.capturePile.length = 0;
  shuffleCards(player.deck);
  emitEvent(game, {
    type: "deckReplenished",
    username: player.username,
    numCards: player.deck.length,
  });
  return { success: true, game };
}

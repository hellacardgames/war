import { emitEvent } from "../../lib/emitEvent.js";
import { shuffleCards } from "../../lib/shuffleCards.js";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { games } from "../games.js";
import { canPlayCardFaceDown } from "../lib/canPlayCardFaceDown.js";
import { canPlayCardFaceUp } from "../lib/canPlayCardFaceUp.js";

type ReplenishDeckResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error:
        | "gameNotFound"
        | "playerNotFound"
        | "invalidStatus"
        | "invalidMove"
        | "deckNotEmpty"
        | "capturePileEmpty";
    };

export function replenishDeck(
  gameId: string,
  playerId: string,
): ReplenishDeckResult {
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
  return { success: true };
}

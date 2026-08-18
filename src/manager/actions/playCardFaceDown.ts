import { emitEvent } from "../../lib/emitEvent.js";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { games } from "../games.js";
import { canPlayCardFaceDown } from "../lib/canPlayCardFaceDown.js";

type PlayCardFaceDownResult =
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
        | "deckEmpty";
    };

export function playCardFaceDown(
  gameId: string,
  playerId: string,
): PlayCardFaceDownResult {
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
  return { success: true };
}

import { emitEvent, shuffle, updatePlayer } from "@hellacardgames/lib";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { canPlayCardFaceDown } from "../lib/canPlayCardFaceDown.js";
import { canPlayCardFaceUp } from "../lib/canPlayCardFaceUp.js";
import { isCapturePileEmpty } from "../lib/isCapturePileEmpty.js";
import { isDeckEmpty } from "../lib/isDeckEmpty.js";
import { requireOtherPlayer } from "../lib/requireOtherPlayer.js";
import type { Game } from "../types/Game.js";

export function replenishDeck(game: Game, playerId: string) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  if (game.status !== "started") {
    return { success: false, error: "invalidStatus" } as const;
  }
  const otherPlayer = requireOtherPlayer(game, player.id);
  if (!(
    canPlayCardFaceDown(player, otherPlayer) || canPlayCardFaceUp(player)
  )) {
    return { success: false, error: "invalidMove" } as const;
  }
  if (!isDeckEmpty(player)) {
    return { success: false, error: "deckNotEmpty" } as const;
  }
  if (isCapturePileEmpty(player)) {
    return { success: false, error: "capturePileEmpty" } as const;
  }

  game = { ...game, expiresAt: Date.now() + EXPIRY_EXTENSION_MS };
  game = emitEvent(game, {
    type: "expirationUpdated",
    expiresAt: game.expiresAt,
  });

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

  return { success: true, game } as const;
}

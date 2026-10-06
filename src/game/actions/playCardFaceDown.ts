import {
  appendItem,
  emitEvent,
  emitEventToOtherPlayer,
  emitEventToPlayer,
  takeLastItem,
  tryGetPlayer,
  updatePlayer,
} from "@hellacardgames/lib";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { checkAndReportRoundWinner } from "../lib/checkAndReportRoundWinner.js";
import { setAvailableActions } from "../lib/setAvailableActions.js";
import type { Game } from "../types/Game.js";

export function playCardFaceDown(game: Game, playerId: string) {
  const { player } = tryGetPlayer(game, playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  if (game.status !== "started") {
    return { success: false, error: "invalidStatus" } as const;
  }
  if (!player.canPlayCardFaceDown) {
    return { success: false, error: "invalidMove" } as const;
  }

  const { collection: newDeck, item: card } = takeLastItem(player.deck);

  game = updatePlayer(game, player.id, (p) => ({
    ...p,
    deck: newDeck,
    battlePile: appendItem(p.battlePile, card),
  }));

  game = emitEventToPlayer(game, player.id, { type: "playerPlayedCard", card });
  game = emitEventToOtherPlayer(game, player.id, {
    type: "otherPlayerPlayedCard",
    card,
  });

  game = setAvailableActions(game);

  game = checkAndReportRoundWinner(game);

  game = { ...game, expiresAt: Date.now() + EXPIRY_EXTENSION_MS };
  game = emitEvent(game, {
    type: "expirationUpdated",
    expiresAt: game.expiresAt,
  });

  return { success: true, game } as const;
}

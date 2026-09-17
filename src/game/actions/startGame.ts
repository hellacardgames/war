import {
  CARDS,
  emitEvent,
  emitEventToOtherPlayers,
  emitEventToPlayer,
  peekItemsAtEvenIndices,
  peekItemsAtOddIndices,
  requirePlayerOne,
  requirePlayerTwo,
  shuffle,
  updatePlayer,
} from "@hellacardgames/lib";
import { EXPIRY_EXTENSION_MS, MIN_PLAYERS } from "../constants.js";
import { transitionGameToStarted } from "../lib/transitionGameToStarted.js";
import type { Game } from "../types/Game.js";

export function startGame(game: Game, playerId: string) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  if (player.id !== game.adminId) {
    return { success: false, error: "playerNotAdmin" } as const;
  }
  if (game.status !== "created") {
    return { success: false, error: "invalidStatus" } as const;
  }
  if (game.players.length < MIN_PLAYERS) {
    return { success: false, error: "minPlayersNotReached" } as const;
  }

  game = transitionGameToStarted(game);
  game = emitEvent(game, { type: "gameStarted" });

  const deck = shuffle(CARDS);

  const playerOne = requirePlayerOne(game);
  const playerOneDeck = peekItemsAtEvenIndices(deck);
  game = updatePlayer(game, playerOne.id, (p) => ({
    ...p,
    deck: playerOneDeck,
  }));
  game = emitEventToPlayer(game, playerOne.id, {
    type: "playerDeckInitialized",
    numCards: playerOneDeck.length,
  });
  game = emitEventToOtherPlayers(game, playerOne.id, {
    type: "otherPlayerDeckInitialized",
    numCards: playerOneDeck.length,
  });

  const playerTwo = requirePlayerTwo(game);
  const playerTwoDeck = peekItemsAtOddIndices(deck);
  game = updatePlayer(game, playerTwo.id, (p) => ({
    ...p,
    deck: playerTwoDeck,
  }));
  game = emitEventToPlayer(game, playerTwo.id, {
    type: "playerDeckInitialized",
    numCards: playerTwoDeck.length,
  });
  game = emitEventToOtherPlayers(game, playerTwo.id, {
    type: "otherPlayerDeckInitialized",
    numCards: playerTwoDeck.length,
  });

  game = { ...game, expiresAt: Date.now() + EXPIRY_EXTENSION_MS };
  game = emitEvent(game, {
    type: "expirationUpdated",
    expiresAt: game.expiresAt,
  });

  return { success: true, game } as const;
}

import {
  emitEvent,
  isPlayerAdmin,
  requirePlayerOne,
  requirePlayerTwo,
  shuffle,
  updatePlayer,
} from "@hellacardgames/lib";
import { CARDS, EXPIRY_EXTENSION_MS, MIN_PLAYERS } from "../constants.js";
import { transitionGameToStarted } from "../lib/transitionGameToStarted.js";
import type { Game } from "../types/Game.js";

export function startGame(game: Game, playerId: string) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  if (!isPlayerAdmin(game, player.id)) {
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
  const playerOneDeck = deck.filter((_, index) => index % 2 === 0);
  game = updatePlayer(game, playerOne.id, (p) => ({
    ...p,
    deck: playerOneDeck,
  }));
  game = emitEvent(game, {
    type: "deckInitialized",
    username: playerOne.username,
    numCards: playerOneDeck.length,
  });

  const playerTwo = requirePlayerTwo(game);
  const playerTwoDeck = deck.filter((_, index) => index % 2 === 1);
  game = updatePlayer(game, playerTwo.id, (p) => ({
    ...p,
    deck: playerTwoDeck,
  }));
  game = emitEvent(game, {
    type: "deckInitialized",
    username: playerTwo.username,
    numCards: playerTwoDeck.length,
  });

  game = { ...game, expiresAt: Date.now() + EXPIRY_EXTENSION_MS };
  game = emitEvent(game, {
    type: "expirationUpdated",
    expiresAt: game.expiresAt,
  });

  return { success: true, game } as const;
}

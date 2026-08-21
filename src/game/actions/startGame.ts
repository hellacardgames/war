import { emitEvent } from "../lib/emitEvent.js";
import { shuffleCards } from "../lib/shuffleCards.js";
import { CARDS, EXPIRY_EXTENSION_MS, MIN_PLAYERS } from "../constants.js";
import type { CreatedGame, StartedGame } from "../types/Game.js";

type StartGameResult =
  | {
      readonly success: true;
      readonly game: StartedGame;
    }
  | {
      readonly success: false;
      readonly error:
        "playerNotFound" | "playerNotAdmin" | "minPlayersNotReached";
    };

export function startGame(
  game: CreatedGame,
  playerId: string,
): StartGameResult {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" };
  }
  if (game.players.indexOf(player) !== 0) {
    return { success: false, error: "playerNotAdmin" };
  }
  if (game.players.length < MIN_PLAYERS) {
    return { success: false, error: "minPlayersNotReached" };
  }
  const deck = [...CARDS];
  shuffleCards(deck);
  let playerIndex = 0;
  for (const card of deck) {
    const player = game.players[playerIndex]!;
    player.deck.push(card);
    playerIndex = (playerIndex + 1) % game.players.length;
  }
  const playerOne = game.players[0]!;
  const playerTwo = game.players[1]!;
  emitEvent(game, {
    type: "deckInitialized",
    username: playerOne.username,
    numCards: playerOne.deck.length,
  });
  emitEvent(game, {
    type: "deckInitialized",
    username: playerTwo.username,
    numCards: playerTwo.deck.length,
  });
  const startedGame: StartedGame = {
    ...game,
    status: "started",
    expiresAt: Date.now() + EXPIRY_EXTENSION_MS,
  };
  emitEvent(startedGame, { type: "gameStarted" });
  emitEvent(startedGame, {
    type: "expirationUpdated",
    expiresAt: startedGame.expiresAt,
  });
  return { success: true, game: startedGame };
}

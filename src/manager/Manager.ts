import {
  CARDS,
  EXPIRY_EXTENSION_MS,
  MAX_GAMES,
  MAX_PLAYERS,
  MIN_PLAYERS,
} from "./constants.js";
import { Watchdog } from "./Watchdog.js";
import { emitEvent } from "../lib/emitEvent.js";
import { shuffleCards } from "../lib/shuffleCards.js";
import { canPlayCardFaceDown } from "./lib/canPlayCardFaceDown.js";
import { canPlayCardFaceUp } from "./lib/canPlayCardFaceUp.js";
import type { ChatMessage } from "./types/ChatMessage.js";
import type { ClientState } from "./types/ClientState.js";
import type { Game } from "./types/Game.js";
import type { GameEvent } from "./types/GameEvent.js";
import type { Player } from "./types/Player.js";

export type CollectCardsResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error:
        "gameNotFound" | "playerNotFound" | "invalidStatus" | "invalidMove";
    };

export type CreateGameResult =
  | {
      readonly success: true;
      readonly gameId: string;
      readonly playerId: string;
    }
  | {
      readonly success: false;
      readonly error: "maxGamesReached";
    };

export type GetClientStateAndClearEventsResult =
  | {
      readonly success: true;
      readonly state: ClientState;
    }
  | {
      readonly success: false;
      readonly error: "gameNotFound" | "playerNotFound";
    };

export type GetEventsAndClearAcknowledgedResult =
  | {
      readonly success: true;
      readonly events: readonly GameEvent[];
    }
  | {
      readonly success: false;
      readonly error: "gameNotFound" | "playerNotFound";
    };

export type GetJoinableGamesResult = {
  readonly games: readonly {
    readonly id: string;
    readonly numPlayers: number;
  }[];
};

export type JoinGameResult =
  | {
      readonly success: true;
      readonly playerId: string;
    }
  | {
      readonly success: false;
      readonly error:
        | "gameNotFound"
        | "invalidStatus"
        | "maxPlayersReached"
        | "alreadyInGame";
    };

export type LeaveGameResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error: "gameNotFound" | "playerNotFound";
    };

export type PlayCardFaceDownResult =
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

export type PlayCardFaceUpResult =
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

export type ReplenishDeckResult =
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

export type SendChatResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error: "gameNotFound" | "playerNotFound";
    };

export type StartGameResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error:
        | "gameNotFound"
        | "playerNotFound"
        | "invalidStatus"
        | "playerNotAdmin"
        | "minPlayersNotReached";
    };

export class Manager {
  private readonly games: Map<string, Game>;
  private readonly watchdog: Watchdog<Game>;

  constructor() {
    this.games = new Map<string, Game>();
    this.watchdog = new Watchdog(this.games);
    this.watchdog.start();
  }

  collectCards(gameId: string, playerId: string): CollectCardsResult {
    const game = this.games.get(gameId);
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
    if (player.battlePile.length % 2 !== 1) {
      return { success: false, error: "invalidMove" };
    }
    const otherPlayer = game.players.find((p) => p !== player)!;
    if (player.battlePile.length < otherPlayer.battlePile.length) {
      return { success: false, error: "invalidMove" };
    }
    if (
      player.battlePile.length > otherPlayer.battlePile.length &&
      (otherPlayer.deck.length > 0 || otherPlayer.capturePile.length > 0)
    ) {
      return { success: false, error: "invalidMove" };
    }
    if (player.battlePile.length === otherPlayer.battlePile.length) {
      const playerCard = player.battlePile[player.battlePile.length - 1]!;
      const otherPlayerCard =
        otherPlayer.battlePile[otherPlayer.battlePile.length - 1]!;
      if (playerCard.rank < otherPlayerCard.rank) {
        return { success: false, error: "invalidMove" };
      }
      if (
        playerCard.rank === otherPlayerCard.rank &&
        (otherPlayer.deck.length > 0 || otherPlayer.capturePile.length > 0)
      ) {
        return { success: false, error: "invalidMove" };
      }
    }
    game.expiresAt = Date.now() + EXPIRY_EXTENSION_MS;
    emitEvent(game, { type: "expirationUpdated", expiresAt: game.expiresAt });
    const collectedCards = [...otherPlayer.battlePile, ...player.battlePile];
    player.capturePile.push(...collectedCards);
    otherPlayer.battlePile.length = 0;
    player.battlePile.length = 0;
    emitEvent(game, {
      type: "cardsCollected",
      username: player.username,
      numCards: collectedCards.length,
    });
    if (otherPlayer.deck.length === 0 && otherPlayer.capturePile.length === 0) {
      emitEvent(game, { type: "gameCompleted" });
      const completedGame: Game = {
        ...game,
        status: "completed",
      };
      this.games.set(game.id, completedGame);
    }
    return { success: true };
  }

  createGame(userId: string, username: string): CreateGameResult {
    if (this.games.size === MAX_GAMES) {
      return { success: false, error: "maxGamesReached" };
    }
    const player: Player = {
      id: crypto.randomUUID(),
      userId,
      username,
      events: [],
      deck: [],
      capturePile: [],
      battlePile: [],
    };
    const createdAt = Date.now();
    const game: Game = {
      status: "open",
      id: crypto.randomUUID(),
      createdAt,
      expiresAt: createdAt + EXPIRY_EXTENSION_MS,
      chatMessages: [],
      players: [player],
    };
    this.games.set(game.id, game);
    return { success: true, gameId: game.id, playerId: player.id };
  }

  getClientStateAndClearEvents(
    gameId: string,
    playerId: string,
  ): GetClientStateAndClearEventsResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    const player = game.players.find((p) => p.id === playerId);
    if (!player) {
      return { success: false, error: "playerNotFound" };
    }
    const state: ClientState = {
      status: game.status,
      gameId,
      playerId,
      username: player.username,
      players: game.players.map((p) => ({
        username: p.username,
        deckSize: p.deck.length,
        capturePileSize: p.capturePile.length,
        battlePile: p.battlePile,
      })),
      expiresAt: game.expiresAt,
      chatMessages: game.chatMessages,
    };
    player.events.length = 0;
    return { success: true, state };
  }

  getEventsAndClearAcknowledged(
    gameId: string,
    playerId: string,
    lastReadId: string | null,
  ): GetEventsAndClearAcknowledgedResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    const player = game.players.find((p) => p.id === playerId);
    if (!player) {
      return { success: false, error: "playerNotFound" };
    }
    const lastReadEventIndex = player.events.findIndex(
      (e) => e.id === lastReadId,
    );
    player.events.splice(0, lastReadEventIndex + 1);
    return { success: true, events: player.events };
  }

  getJoinableGames(): GetJoinableGamesResult {
    return {
      games: Array.from(this.games.values())
        .filter((g) => g.status === "open" && g.players.length < MAX_PLAYERS)
        .map((g) => ({
          id: g.id,
          numPlayers: g.players.length,
        })),
    };
  }

  joinGame(gameId: string, userId: string, username: string): JoinGameResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    if (game.status !== "open") {
      return { success: false, error: "invalidStatus" };
    }
    if (game.players.length === MAX_PLAYERS) {
      return { success: false, error: "maxPlayersReached" };
    }
    if (game.players.find((p) => p.userId === userId)) {
      return { success: false, error: "alreadyInGame" };
    }
    const player: Player = {
      id: crypto.randomUUID(),
      userId,
      username,
      events: [],
      deck: [],
      capturePile: [],
      battlePile: [],
    };
    game.players.push(player);
    emitEvent(game, { type: "playerJoined", username });
    return { success: true, playerId: player.id };
  }

  leaveGame(gameId: string, playerId: string): LeaveGameResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    const playerIndex = game.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) {
      return { success: false, error: "playerNotFound" };
    }

    const player = game.players[playerIndex]!;
    emitEvent(game, { type: "playerLeft", username: player.username });

    game.players.splice(playerIndex, 1);

    if (game.status === "started" && game.players.length < MIN_PLAYERS) {
      const forfeitedGame: Game = {
        ...game,
        status: "forfeited",
        expiresAt: Date.now() + EXPIRY_EXTENSION_MS,
      };
      this.games.set(game.id, forfeitedGame);
      emitEvent(forfeitedGame, { type: "gameForfeited" });
      emitEvent(forfeitedGame, {
        type: "expirationUpdated",
        expiresAt: forfeitedGame.expiresAt,
      });
    }
    if (game.players.length === 0) {
      this.games.delete(game.id);
    }
    return { success: true };
  }

  playCardFaceDown(gameId: string, playerId: string): PlayCardFaceDownResult {
    const game = this.games.get(gameId);
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

  playCardFaceUp(gameId: string, playerId: string): PlayCardFaceUpResult {
    const game = this.games.get(gameId);
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
    return { success: true };
  }

  replenishDeck(gameId: string, playerId: string): ReplenishDeckResult {
    const game = this.games.get(gameId);
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

  sendChat(gameId: string, playerId: string, text: string): SendChatResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    const player = game.players.find((p) => p.id === playerId);
    if (!player) {
      return { success: false, error: "playerNotFound" };
    }
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      username: player.username,
      text,
    };
    game.chatMessages.push(message);
    emitEvent(game, { type: "chat", message });
    return { success: true };
  }

  startGame(gameId: string, playerId: string): StartGameResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    const player = game.players.find((p) => p.id === playerId);
    if (!player) {
      return { success: false, error: "playerNotFound" };
    }
    if (game.status !== "open") {
      return { success: false, error: "invalidStatus" };
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
    const startedGame: Game = {
      ...game,
      status: "started",
      expiresAt: Date.now() + EXPIRY_EXTENSION_MS,
    };
    this.games.set(game.id, startedGame);
    emitEvent(startedGame, { type: "gameStarted" });
    emitEvent(startedGame, {
      type: "expirationUpdated",
      expiresAt: startedGame.expiresAt,
    });
    return { success: true };
  }
}

import { ManagerBase } from "@hellacardgames/lib";
import {
  collectCards,
  createGame,
  getClientStateAndClearEvents,
  getEventsAndClearAcknowledged,
  joinGame,
  leaveGame,
  MAX_PLAYERS,
  playCardFaceDown,
  playCardFaceUp,
  replenishDeck,
  sendChat,
  startGame,
} from "../game/index.js";
import type { ClientState, Game, GameEvent } from "../game/index.js";

export type CollectCardsResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error:
        "gameNotFound" | "invalidStatus" | "playerNotFound" | "invalidMove";
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
        | "invalidStatus"
        | "playerNotFound"
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
        | "invalidStatus"
        | "playerNotFound"
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
        | "invalidStatus"
        | "playerNotFound"
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
        | "invalidStatus"
        | "playerNotFound"
        | "playerNotAdmin"
        | "minPlayersNotReached";
    };

export class Manager extends ManagerBase<Game> {
  collectCards(gameId: string, playerId: string): CollectCardsResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    if (game.status !== "started") {
      return { success: false, error: "invalidStatus" };
    }
    const result = collectCards(game, playerId);
    if (!result.success) {
      return result;
    }
    this.games.set(gameId, result.game);
    return { success: true };
  }

  createGame(userId: string, username: string): CreateGameResult {
    if (this.games.size === this.maxGames) {
      return { success: false, error: "maxGamesReached" };
    }
    const result = createGame(userId, username);
    this.games.set(result.game.id, result.game);
    return { success: true, gameId: result.game.id, playerId: result.playerId };
  }

  getClientStateAndClearEvents(
    gameId: string,
    playerId: string,
  ): GetClientStateAndClearEventsResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    const result = getClientStateAndClearEvents(game, playerId);
    if (!result.success) {
      return result;
    }
    this.games.set(gameId, result.game);
    return { success: true, state: result.state };
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
    const result = getEventsAndClearAcknowledged(game, playerId, lastReadId);
    if (!result.success) {
      return result;
    }
    this.games.set(gameId, result.game);
    return { success: true, events: result.events };
  }

  getJoinableGames(): GetJoinableGamesResult {
    return {
      games: Array.from(this.games.values())
        .filter((g) => g.status === "created" && g.players.length < MAX_PLAYERS)
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
    if (game.status !== "created") {
      return { success: false, error: "invalidStatus" };
    }
    const result = joinGame(game, userId, username);
    if (!result.success) {
      return result;
    }
    this.games.set(gameId, result.game);
    return { success: true, playerId: result.playerId };
  }

  leaveGame(gameId: string, playerId: string): LeaveGameResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    const result = leaveGame(game, playerId);
    if (!result.success) {
      return result;
    }
    if (result.game.players.length > 0) {
      this.games.set(gameId, result.game);
    } else {
      this.games.delete(gameId);
    }
    return { success: true };
  }

  playCardFaceDown(gameId: string, playerId: string): PlayCardFaceDownResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    if (game.status !== "started") {
      return { success: false, error: "invalidStatus" };
    }
    const result = playCardFaceDown(game, playerId);
    if (!result.success) {
      return result;
    }
    this.games.set(gameId, result.game);
    return { success: true };
  }

  playCardFaceUp(gameId: string, playerId: string): PlayCardFaceUpResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    if (game.status !== "started") {
      return { success: false, error: "invalidStatus" };
    }
    const result = playCardFaceUp(game, playerId);
    if (!result.success) {
      return result;
    }
    this.games.set(gameId, result.game);
    return { success: true };
  }

  replenishDeck(gameId: string, playerId: string): ReplenishDeckResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    if (game.status !== "started") {
      return { success: false, error: "invalidStatus" };
    }
    const result = replenishDeck(game, playerId);
    if (!result.success) {
      return result;
    }
    this.games.set(gameId, result.game);
    return { success: true };
  }

  sendChat(gameId: string, playerId: string, text: string): SendChatResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    const result = sendChat(game, playerId, text);
    if (!result.success) {
      return result;
    }
    this.games.set(gameId, result.game);
    return { success: true };
  }

  startGame(gameId: string, playerId: string): StartGameResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    if (game.status !== "created") {
      return { success: false, error: "invalidStatus" };
    }
    const result = startGame(game, playerId);
    if (!result.success) {
      return result;
    }
    this.games.set(gameId, result.game);
    return { success: true };
  }
}

import { z } from "zod";
import { Manager } from "../manager/index.js";
import type { ClientState, GameEvent } from "../manager/index.js";

export type CollectCardsResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error:
        | "invalidInput"
        | "gameNotFound"
        | "playerNotFound"
        | "invalidStatus"
        | "invalidMove";
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
      readonly error: "invalidInput" | "gameNotFound" | "playerNotFound";
    };

export type GetEventsAndClearAcknowledgedResult =
  | {
      readonly success: true;
      readonly events: readonly GameEvent[];
    }
  | {
      readonly success: false;
      readonly error: "invalidInput" | "gameNotFound" | "playerNotFound";
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
        | "invalidInput"
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
      readonly error: "invalidInput" | "gameNotFound" | "playerNotFound";
    };

export type PlayCardFaceDownResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error:
        | "invalidInput"
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
        | "invalidInput"
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
        | "invalidInput"
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
      readonly error: "invalidInput" | "gameNotFound" | "playerNotFound";
    };

export type StartGameResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error:
        | "invalidInput"
        | "gameNotFound"
        | "invalidStatus"
        | "playerNotFound"
        | "playerNotAdmin"
        | "minPlayersNotReached";
    };

const collectCardsInputSchema = z
  .object({
    gameId: z.string(),
    playerId: z.string(),
  })
  .transform(({ gameId, playerId }) => [gameId, playerId] as const);

const getClientStateAndClearEventsInputSchema = z
  .object({
    gameId: z.string(),
    playerId: z.string(),
  })
  .transform(({ gameId, playerId }) => [gameId, playerId] as const);

const getEventsAndClearAcknowledgedInputSchema = z
  .object({
    gameId: z.string(),
    playerId: z.string(),
    lastReadId: z.string().nullable(),
  })
  .transform(
    ({ gameId, playerId, lastReadId }) =>
      [gameId, playerId, lastReadId] as const,
  );

const joinGameInputSchema = z
  .object({
    gameId: z.string(),
  })
  .transform(({ gameId }) => [gameId] as const);

const leaveGameInputSchema = z
  .object({
    gameId: z.string(),
    playerId: z.string(),
  })
  .transform(({ gameId, playerId }) => [gameId, playerId] as const);

const playCardFaceDownInputSchema = z
  .object({
    gameId: z.string(),
    playerId: z.string(),
  })
  .transform(({ gameId, playerId }) => [gameId, playerId] as const);

const playCardFaceUpInputSchema = z
  .object({
    gameId: z.string(),
    playerId: z.string(),
  })
  .transform(({ gameId, playerId }) => [gameId, playerId] as const);

const replenishDeckInputSchema = z
  .object({
    gameId: z.string(),
    playerId: z.string(),
  })
  .transform(({ gameId, playerId }) => [gameId, playerId] as const);

const sendChatInputSchema = z
  .object({
    gameId: z.string(),
    playerId: z.string(),
    text: z.string(),
  })
  .transform(({ gameId, playerId, text }) => [gameId, playerId, text] as const);

const startGameInputSchema = z
  .object({
    gameId: z.string(),
    playerId: z.string(),
  })
  .transform(({ gameId, playerId }) => [gameId, playerId] as const);

export class Server {
  private readonly manager: Manager;

  readonly actions = [
    { path: "/collectCards", action: this.collectCards.bind(this) },
    { path: "/createGame", action: this.createGame.bind(this) },
    {
      path: "/getClientStateAndClearEvents",
      action: this.getClientStateAndClearEvents.bind(this),
    },
    {
      path: "/getEventsAndClearAcknowledged",
      action: this.getEventsAndClearAcknowledged.bind(this),
    },
    { path: "/getJoinableGames", action: this.getJoinableGames.bind(this) },
    { path: "/joinGame", action: this.joinGame.bind(this) },
    { path: "/leaveGame", action: this.leaveGame.bind(this) },
    { path: "/playCardFaceDown", action: this.playCardFaceDown.bind(this) },
    { path: "/playCardFaceUp", action: this.playCardFaceUp.bind(this) },
    { path: "/replenishDeck", action: this.replenishDeck.bind(this) },
    { path: "/sendChat", action: this.sendChat.bind(this) },
    { path: "/startGame", action: this.startGame.bind(this) },
  ] as const;

  constructor(...args: ConstructorParameters<typeof Manager>) {
    this.manager = new Manager(...args);
  }

  private collectCards(input: unknown): CollectCardsResult {
    const parseResult = collectCardsInputSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: "invalidInput" };
    }
    return this.manager.collectCards(...parseResult.data);
  }

  private createGame(userId: string, username: string): CreateGameResult {
    return this.manager.createGame(userId, username);
  }

  private getClientStateAndClearEvents(
    input: unknown,
  ): GetClientStateAndClearEventsResult {
    const parseResult =
      getClientStateAndClearEventsInputSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: "invalidInput" };
    }
    return this.manager.getClientStateAndClearEvents(...parseResult.data);
  }

  private getEventsAndClearAcknowledged(
    input: unknown,
  ): GetEventsAndClearAcknowledgedResult {
    const parseResult =
      getEventsAndClearAcknowledgedInputSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: "invalidInput" };
    }
    return this.manager.getEventsAndClearAcknowledged(...parseResult.data);
  }

  private getJoinableGames(): GetJoinableGamesResult {
    return this.manager.getJoinableGames();
  }

  private joinGame(
    input: unknown,
    userId: string,
    username: string,
  ): JoinGameResult {
    const parseResult = joinGameInputSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: "invalidInput" };
    }
    return this.manager.joinGame(...parseResult.data, userId, username);
  }

  private leaveGame(input: unknown): LeaveGameResult {
    const parseResult = leaveGameInputSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: "invalidInput" };
    }
    return this.manager.leaveGame(...parseResult.data);
  }

  private playCardFaceDown(input: unknown): PlayCardFaceDownResult {
    const parseResult = playCardFaceDownInputSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: "invalidInput" };
    }
    return this.manager.playCardFaceDown(...parseResult.data);
  }

  private playCardFaceUp(input: unknown): PlayCardFaceUpResult {
    const parseResult = playCardFaceUpInputSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: "invalidInput" };
    }
    return this.manager.playCardFaceUp(...parseResult.data);
  }

  private replenishDeck(input: unknown): ReplenishDeckResult {
    const parseResult = replenishDeckInputSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: "invalidInput" };
    }
    return this.manager.replenishDeck(...parseResult.data);
  }

  private sendChat(input: unknown): SendChatResult {
    const parseResult = sendChatInputSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: "invalidInput" };
    }
    return this.manager.sendChat(...parseResult.data);
  }

  private startGame(input: unknown): StartGameResult {
    const parseResult = startGameInputSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: "invalidInput" };
    }
    return this.manager.startGame(...parseResult.data);
  }
}

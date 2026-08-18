import type { CollectCardsResult } from "../server/actions/collectCards.js";
import type { CreateGameResult } from "../server/actions/createGame.js";
import type { GetClientStateAndClearEventsResult } from "../server/actions/getClientStateAndClearEvents.js";
import type { GetEventsAndClearAcknowledgedResult } from "../server/actions/getEventsAndClearAcknowledged.js";
import type { GetJoinableGamesResult } from "../server/actions/getJoinableGames.js";
import type { JoinGameResult } from "../server/actions/joinGame.js";
import type { LeaveGameResult } from "../server/actions/leaveGame.js";
import type { PlayCardFaceDownResult } from "../server/actions/playCardFaceDown.js";
import type { PlayCardFaceUpResult } from "../server/actions/playCardFaceUp.js";
import type { ReplenishDeckResult } from "../server/actions/replenishDeck.js";
import type { SendChatResult } from "../server/actions/sendChat.js";
import type { StartGameResult } from "../server/actions/startGame.js";
import type { Card } from "../manager/types/Card.js";
import type { ChatMessage } from "../manager/types/ChatMessage.js";
import type { ClientState } from "../manager/types/ClientState.js";
import type { GameEvent } from "../manager/types/GameEvent.js";

export type {
  CollectCardsResult,
  CreateGameResult,
  GetClientStateAndClearEventsResult,
  GetEventsAndClearAcknowledgedResult,
  GetJoinableGamesResult,
  JoinGameResult,
  LeaveGameResult,
  PlayCardFaceDownResult,
  PlayCardFaceUpResult,
  ReplenishDeckResult,
  SendChatResult,
  StartGameResult,
  Card,
  ChatMessage,
  ClientState,
  GameEvent,
};

type ClientConfig = {
  readonly baseUrl: string;
  readonly actionUrls: {
    readonly collectCards: string;
    readonly createGame: string;
    readonly getClientStateAndClearEvents: string;
    readonly getEventsAndClearAcknowledged: string;
    readonly getJoinableGames: string;
    readonly joinGame: string;
    readonly leaveGame: string;
    readonly playCardFaceDown: string;
    readonly playCardFaceUp: string;
    readonly replenishDeck: string;
    readonly sendChat: string;
    readonly startGame: string;
  };
};

export class Client {
  private readonly actionUrls: ClientConfig["actionUrls"];

  constructor(config: ClientConfig) {
    this.actionUrls = {
      collectCards: `${config.baseUrl}${config.actionUrls.collectCards}`,
      createGame: `${config.baseUrl}${config.actionUrls.createGame}`,
      getClientStateAndClearEvents: `${config.baseUrl}${config.actionUrls.getClientStateAndClearEvents}`,
      getEventsAndClearAcknowledged: `${config.baseUrl}${config.actionUrls.getEventsAndClearAcknowledged}`,
      getJoinableGames: `${config.baseUrl}${config.actionUrls.getJoinableGames}`,
      joinGame: `${config.baseUrl}${config.actionUrls.joinGame}`,
      leaveGame: `${config.baseUrl}${config.actionUrls.leaveGame}`,
      playCardFaceDown: `${config.baseUrl}${config.actionUrls.playCardFaceDown}`,
      playCardFaceUp: `${config.baseUrl}${config.actionUrls.playCardFaceUp}`,
      replenishDeck: `${config.baseUrl}${config.actionUrls.replenishDeck}`,
      sendChat: `${config.baseUrl}${config.actionUrls.sendChat}`,
      startGame: `${config.baseUrl}${config.actionUrls.startGame}`,
    };
  }

  async collectCards(
    gameId: string,
    playerId: string,
  ): Promise<CollectCardsResult> {
    const response = await fetch(`${this.actionUrls.collectCards}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result = await response.json();
    return result;
  }

  async createGame(accessToken: string): Promise<CreateGameResult> {
    const response = await fetch(`${this.actionUrls.createGame}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await response.json();
    return result;
  }

  async getClientStateAndClearEvents(
    gameId: string,
    playerId: string,
  ): Promise<GetClientStateAndClearEventsResult> {
    const response = await fetch(
      `${this.actionUrls.getClientStateAndClearEvents}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId, playerId }),
      },
    );
    const result = await response.json();
    return result;
  }

  async getEventsAndClearAcknowledged(
    gameId: string,
    playerId: string,
    lastReadId: string | null,
  ): Promise<GetEventsAndClearAcknowledgedResult> {
    const response = await fetch(
      `${this.actionUrls.getEventsAndClearAcknowledged}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId, playerId, lastReadId }),
      },
    );
    const result = await response.json();
    return result;
  }

  async getJoinableGames(): Promise<GetJoinableGamesResult> {
    const response = await fetch(`${this.actionUrls.getJoinableGames}`, {
      method: "POST",
    });
    const result = await response.json();
    return result;
  }

  async joinGame(gameId: string, accessToken: string): Promise<JoinGameResult> {
    const response = await fetch(`${this.actionUrls.joinGame}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId }),
    });
    const result = await response.json();
    return result;
  }

  async leaveGame(gameId: string, playerId: string): Promise<LeaveGameResult> {
    const response = await fetch(`${this.actionUrls.leaveGame}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result = await response.json();
    return result;
  }

  async playCardFaceDown(
    gameId: string,
    playerId: string,
    cardId: string,
  ): Promise<PlayCardFaceDownResult> {
    const response = await fetch(`${this.actionUrls.playCardFaceDown}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId, cardId }),
    });
    const result = await response.json();
    return result;
  }

  async playCardFaceUp(
    gameId: string,
    playerId: string,
    cardId: string,
  ): Promise<PlayCardFaceUpResult> {
    const response = await fetch(`${this.actionUrls.playCardFaceUp}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId, cardId }),
    });
    const result = await response.json();
    return result;
  }

  async replenishDeck(
    gameId: string,
    playerId: string,
  ): Promise<ReplenishDeckResult> {
    const response = await fetch(`${this.actionUrls.replenishDeck}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result = await response.json();
    return result;
  }

  async sendChat(
    gameId: string,
    playerId: string,
    text: string,
  ): Promise<SendChatResult> {
    const response = await fetch(`${this.actionUrls.sendChat}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId, text }),
    });
    const result = await response.json();
    return result;
  }

  async startGame(gameId: string, playerId: string): Promise<StartGameResult> {
    const response = await fetch(`${this.actionUrls.startGame}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result = await response.json();
    return result;
  }
}

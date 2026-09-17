import type { Card } from "./Card.js";
import type { ChatMessage } from "./ChatMessage.js";

export type GameEvent =
  | {
      readonly type: "adminChanged";
      readonly id: string;
      readonly username: string;
    }
  | {
      readonly type: "chat";
      readonly id: string;
      readonly message: ChatMessage;
    }
  | {
      readonly type: "expirationUpdated";
      readonly id: string;
      readonly expiresAt: number;
    }
  | {
      readonly type: "gameCompleted";
      readonly id: string;
    }
  | {
      readonly type: "gameForfeited";
      readonly id: string;
    }
  | {
      readonly type: "gameStarted";
      readonly id: string;
    }
  | {
      readonly type: "otherPlayerCollectedCards";
      readonly id: string;
      readonly numCards: number;
    }
  | {
      readonly type: "otherPlayerDeckInitialized";
      readonly id: string;
      readonly numCards: number;
    }
  | {
      readonly type: "otherPlayerDeckReplenished";
      readonly id: string;
      readonly numCards: number;
    }
  | {
      readonly type: "otherPlayerJoined";
      readonly id: string;
      readonly username: string;
    }
  | {
      readonly type: "otherPlayerLeft";
      readonly id: string;
    }
  | {
      readonly type: "otherPlayerPlayedCard";
      readonly id: string;
      readonly card: Card;
    }
  | {
      readonly type: "playerCollectedCards";
      readonly id: string;
      readonly numCards: number;
    }
  | {
      readonly type: "playerDeckInitialized";
      readonly id: string;
      readonly numCards: number;
    }
  | {
      readonly type: "playerDeckReplenished";
      readonly id: string;
      readonly numCards: number;
    }
  | {
      readonly type: "playerPlayedCard";
      readonly id: string;
      readonly card: Card;
    };

import type { Card } from "./Card.js";
import type { ChatMessage } from "./ChatMessage.js";

export type GameEvent =
  | {
      readonly type: "cardPlayed";
      readonly id: string;
      readonly username: string;
      readonly card: Card;
    }
  | {
      readonly type: "cardsCollected";
      readonly id: string;
      readonly username: string;
      readonly numCards: number;
    }
  | {
      readonly type: "chat";
      readonly id: string;
      readonly message: ChatMessage;
    }
  | {
      readonly type: "deckInitialized";
      readonly id: string;
      readonly username: string;
      readonly numCards: number;
    }
  | {
      readonly type: "deckReplenished";
      readonly id: string;
      readonly username: string;
      readonly numCards: number;
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
      readonly type: "playerJoined";
      readonly id: string;
      readonly username: string;
    }
  | {
      readonly type: "playerLeft";
      readonly id: string;
      readonly username: string;
    };

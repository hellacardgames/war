import type { Card } from "./Card.js";
import type { ChatMessage } from "./ChatMessage.js";

export type ClientState = {
  readonly status: "created" | "started" | "completed" | "forfeited";
  readonly gameId: string;
  readonly playerId: string;
  readonly player: Player;
  readonly otherPlayer: OtherPlayer | null;
  readonly adminUsername: string;
  readonly expiresAt: number;
  readonly chatMessages: readonly ChatMessage[];
  readonly gameWinnerUsername: string | null;
};

type Player = {
  readonly username: string;
  readonly deckSize: number;
  readonly capturePileSize: number;
  readonly battlePile: readonly Card[];
  readonly roundWinner: boolean;
  readonly canPlayCardFaceUp: boolean;
  readonly canPlayCardFaceDown: boolean;
  readonly canReplenishDeck: boolean;
};

type OtherPlayer = {
  readonly username: string;
  readonly deckSize: number;
  readonly capturePileSize: number;
  readonly battlePile: readonly Card[];
  readonly roundWinner: boolean;
};

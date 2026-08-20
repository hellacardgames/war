import type { Card } from "./Card.js";
import type { ChatMessage } from "./ChatMessage.js";

export type ClientState = {
  readonly status: "open" | "started" | "completed" | "forfeited";
  readonly gameId: string;
  readonly playerId: string;
  readonly username: string;
  readonly players: readonly Player[];
  readonly expiresAt: number;
  readonly chatMessages: readonly ChatMessage[];
};

type Player = {
  readonly username: string;
  readonly deckSize: number;
  readonly capturePileSize: number;
  readonly battlePile: readonly Card[];
};

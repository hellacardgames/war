import { createClientFactory } from "@hellacardgames/lib";
import type { Manager } from "../manager/createManager.js";
import type { Server } from "../server/createServer.js";

export type Client = ReturnType<typeof createClient>;

export const createClient = createClientFactory<Server, Manager>({
  collectCards: (gameId: string, playerId: string) => ({
    gameId,
    playerId,
  }),
  playCardFaceDown: (gameId: string, playerId: string) => ({
    gameId,
    playerId,
  }),
  playCardFaceUp: (gameId: string, playerId: string) => ({
    gameId,
    playerId,
  }),
  replenishDeck: (gameId: string, playerId: string) => ({
    gameId,
    playerId,
  }),
});

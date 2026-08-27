import { createClientFactory } from "@hellacardgames/lib";
import type { createManager } from "../manager/createManager.js";
import type { createServer } from "../server/createServer.js";

export const createClient = createClientFactory<
  ReturnType<typeof createServer>,
  ReturnType<typeof createManager>
>({
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

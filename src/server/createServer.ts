import { z } from "zod";
import { createServerFactory } from "@hellacardgames/lib";
import { createManager } from "../manager/index.js";

export const createServer = createServerFactory(createManager, {
  collectCards: z
    .object({
      gameId: z.string(),
      playerId: z.string(),
    })
    .transform(({ gameId, playerId }) => [gameId, playerId] as const),

  playCardFaceDown: z
    .object({
      gameId: z.string(),
      playerId: z.string(),
    })
    .transform(({ gameId, playerId }) => [gameId, playerId] as const),

  playCardFaceUp: z
    .object({
      gameId: z.string(),
      playerId: z.string(),
    })
    .transform(({ gameId, playerId }) => [gameId, playerId] as const),

  replenishDeck: z
    .object({
      gameId: z.string(),
      playerId: z.string(),
    })
    .transform(({ gameId, playerId }) => [gameId, playerId] as const),
});

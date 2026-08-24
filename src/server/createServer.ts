import { z } from "zod";
import { createServerFactory } from "@hellacardgames/lib";
import { createManager } from "../manager/index.js";

export const createServer = createServerFactory(createManager, (manager) => {
  const collectCardsInputSchema = z
    .object({
      gameId: z.string(),
      playerId: z.string(),
    })
    .transform(({ gameId, playerId }) => [gameId, playerId] as const);

  function collectCards(input: unknown) {
    const parseResult = collectCardsInputSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: "invalidInput" } as const;
    }
    return manager.collectCards(...parseResult.data);
  }

  const playCardFaceDownInputSchema = z
    .object({
      gameId: z.string(),
      playerId: z.string(),
    })
    .transform(({ gameId, playerId }) => [gameId, playerId] as const);

  function playCardFaceDown(input: unknown) {
    const parseResult = playCardFaceDownInputSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: "invalidInput" } as const;
    }
    return manager.playCardFaceDown(...parseResult.data);
  }

  const playCardFaceUpInputSchema = z
    .object({
      gameId: z.string(),
      playerId: z.string(),
    })
    .transform(({ gameId, playerId }) => [gameId, playerId] as const);

  function playCardFaceUp(input: unknown) {
    const parseResult = playCardFaceUpInputSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: "invalidInput" } as const;
    }
    return manager.playCardFaceUp(...parseResult.data);
  }

  const replenishDeckInputSchema = z
    .object({
      gameId: z.string(),
      playerId: z.string(),
    })
    .transform(({ gameId, playerId }) => [gameId, playerId] as const);

  function replenishDeck(input: unknown) {
    const parseResult = replenishDeckInputSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: "invalidInput" } as const;
    }
    return manager.replenishDeck(...parseResult.data);
  }

  return [
    { path: "/collectCards", action: collectCards },
    { path: "/playCardFaceDown", action: playCardFaceDown },
    { path: "/playCardFaceUp", action: playCardFaceUp },
    { path: "/replenishDeck", action: replenishDeck },
  ];
});

import { z } from "zod";
import { replenishDeck as doReplenishDeck } from "../../manager/actions/replenishDeck.js";

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

const inputSchema = z
  .object({
    gameId: z.string(),
    playerId: z.string(),
  })
  .transform(({ gameId, playerId }) => [gameId, playerId] as const);

export function replenishDeck(input: unknown): ReplenishDeckResult {
  const parseResult = inputSchema.safeParse(input);
  if (!parseResult.success) {
    return { success: false, error: "invalidInput" };
  }
  return doReplenishDeck(...parseResult.data);
}

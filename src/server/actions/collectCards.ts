import { z } from "zod";
import { collectCards as doCollectCards } from "../../manager/actions/collectCards.js";

export type CollectCardsResult =
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
        | "invalidMove";
    };
const inputSchema = z
  .object({
    gameId: z.string(),
    playerId: z.string(),
  })
  .transform(({ gameId, playerId }) => [gameId, playerId] as const);

export function collectCards(input: unknown): CollectCardsResult {
  const parseResult = inputSchema.safeParse(input);
  if (!parseResult.success) {
    return { success: false, error: "invalidInput" };
  }
  return doCollectCards(...parseResult.data);
}

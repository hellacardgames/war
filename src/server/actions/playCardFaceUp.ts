import { z } from "zod";
import { playCardFaceUp as doPlayCardFaceUp } from "../../manager/index.js";

export type PlayCardFaceUpResult =
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
        | "deckEmpty";
    };

const inputSchema = z
  .object({
    gameId: z.string(),
    playerId: z.string(),
  })
  .transform(({ gameId, playerId }) => [gameId, playerId] as const);

export function playCardFaceUp(input: unknown): PlayCardFaceUpResult {
  const parseResult = inputSchema.safeParse(input);
  if (!parseResult.success) {
    return { success: false, error: "invalidInput" };
  }
  return doPlayCardFaceUp(...parseResult.data);
}

import { z } from "zod";
import { playCardFaceDown as doPlayCardFaceDown } from "../../manager/actions/playCardFaceDown.js";

export type PlayCardFaceDownResult =
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

export function playCardFaceDown(input: unknown): PlayCardFaceDownResult {
  const parseResult = inputSchema.safeParse(input);
  if (!parseResult.success) {
    return { success: false, error: "invalidInput" };
  }
  return doPlayCardFaceDown(...parseResult.data);
}

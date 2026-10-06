import {
  emitEventToOtherPlayer,
  emitEventToPlayer,
  getPlayerOne,
  getPlayerTwo,
  updatePlayer,
} from "@hellacardgames/lib";
import { isRoundWinner } from "./isRoundWinner.js";
import type { StartedGame } from "../types/Game.js";

export function checkAndReportRoundWinner(game: StartedGame): StartedGame {
  const playerOne = getPlayerOne(game);
  const playerTwo = getPlayerTwo(game);

  let roundWinnerId: string | null = null;

  if (isRoundWinner(game, playerOne.id)) {
    roundWinnerId = playerOne.id;
  } else if (isRoundWinner(game, playerTwo.id)) {
    roundWinnerId = playerTwo.id;
  }

  if (roundWinnerId !== null) {
    game = updatePlayer(game, roundWinnerId, (p) => ({
      ...p,
      roundWinner: true,
    }));
    game = emitEventToPlayer(game, roundWinnerId, { type: "playerWonRound" });
    game = emitEventToOtherPlayer(game, roundWinnerId, {
      type: "otherPlayerWonRound",
    });
  }

  return game;
}

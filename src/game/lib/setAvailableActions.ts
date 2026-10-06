import {
  emitEventToPlayer,
  getPlayerOne,
  getPlayerTwo,
  updatePlayer,
} from "@hellacardgames/lib";
import { canPlayCardFaceUp } from "./canPlayCardFaceUp.js";
import { canPlayCardFaceDown } from "./canPlayCardFaceDown.js";
import type { StartedGame } from "../types/Game.js";
import type { Player } from "../types/Player.js";

export function setAvailableActions(game: StartedGame): StartedGame {
  const playerOne = getPlayerOne(game);
  const playerTwo = getPlayerTwo(game);

  const playerOneFlags = {
    canPlayCardFaceUp: canPlayCardFaceUp(playerOne),
    canPlayCardFaceDown: canPlayCardFaceDown(playerOne, playerTwo),
    canReplenishDeck:
      playerOne.deck.length === 0 && playerOne.capturePile.length > 0,
  } satisfies Partial<Player>;

  game = updatePlayer(game, playerOne.id, (p) => ({ ...p, ...playerOneFlags }));
  game = emitEventToPlayer(game, playerOne.id, {
    type: "playerAvailableActionsSet",
    ...playerOneFlags,
  });

  const playerTwoFlags = {
    canPlayCardFaceUp: canPlayCardFaceUp(playerTwo),
    canPlayCardFaceDown: canPlayCardFaceDown(playerTwo, playerOne),
    canReplenishDeck:
      playerTwo.deck.length === 0 && playerTwo.capturePile.length > 0,
  } satisfies Partial<Player>;

  game = updatePlayer(game, playerTwo.id, (p) => ({ ...p, ...playerTwoFlags }));
  game = emitEventToPlayer(game, playerTwo.id, {
    type: "playerAvailableActionsSet",
    ...playerTwoFlags,
  });

  return game;
}

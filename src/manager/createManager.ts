import { createManagerFactory } from "@hellacardgames/lib";
import {
  collectCards,
  createGame,
  getClientStateAndClearEvents,
  getEventsAndClearAcknowledged,
  joinGame,
  leaveGame,
  MAX_PLAYERS,
  playCardFaceDown,
  playCardFaceUp,
  replenishDeck,
  sendChat,
  startGame,
} from "../game/index.js";

export const createManager = createManagerFactory({
  maxPlayers: MAX_PLAYERS,
  createGame,
  getClientStateAndClearEvents,
  getEventsAndClearAcknowledged,
  joinGame,
  leaveGame,
  sendChat,
  startGame,
  addCustomActions: (wrapAction) => ({
    collectCards: wrapAction(collectCards),
    playCardFaceDown: wrapAction(playCardFaceDown),
    playCardFaceUp: wrapAction(playCardFaceUp),
    replenishDeck: wrapAction(replenishDeck),
  }),
});

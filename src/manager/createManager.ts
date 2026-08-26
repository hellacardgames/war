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
  gameplayActions: {
    collectCards,
    playCardFaceDown,
    playCardFaceUp,
    replenishDeck,
  },
});

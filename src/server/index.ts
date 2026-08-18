import { collectCards } from "./actions/collectCards.js";
import { createGame } from "./actions/createGame.js";
import { getClientStateAndClearEvents } from "./actions/getClientStateAndClearEvents.js";
import { getEventsAndClearAcknowledged } from "./actions/getEventsAndClearAcknowledged.js";
import { getJoinableGames } from "./actions/getJoinableGames.js";
import { joinGame } from "./actions/joinGame.js";
import { leaveGame } from "./actions/leaveGame.js";
import { playCardFaceDown } from "./actions/playCardFaceDown.js";
import { playCardFaceUp } from "./actions/playCardFaceUp.js";
import { replenishDeck } from "./actions/replenishDeck.js";
import { sendChat } from "./actions/sendChat.js";
import { startGame } from "./actions/startGame.js";

export const actions = [
  { path: "/collectCards", action: collectCards },
  { path: "/createGame", action: createGame },
  {
    path: "/getClientStateAndClearEvents",
    action: getClientStateAndClearEvents,
  },
  {
    path: "/getEventsAndClearAcknowledged",
    action: getEventsAndClearAcknowledged,
  },
  { path: "/getJoinableGames", action: getJoinableGames },
  { path: "/joinGame", action: joinGame },
  { path: "/leaveGame", action: leaveGame },
  { path: "/playCardFaceDown", action: playCardFaceDown },
  { path: "/playCardFaceUp", action: playCardFaceUp },
  { path: "/replenishDeck", action: replenishDeck },
  { path: "/sendChat", action: sendChat },
  { path: "/startGame", action: startGame },
] as const;

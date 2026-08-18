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
  { path: "/collectCards", func: collectCards },
  { path: "/createGame", func: createGame },
  { path: "/getClientStateAndClearEvents", func: getClientStateAndClearEvents },
  {
    path: "/getEventsAndClearAcknowledged",
    func: getEventsAndClearAcknowledged,
  },
  { path: "/getJoinableGames", func: getJoinableGames },
  { path: "/joinGame", func: joinGame },
  { path: "/leaveGame", func: leaveGame },
  { path: "/playCardFaceDown", func: playCardFaceDown },
  { path: "/playCardFaceUp", func: playCardFaceUp },
  { path: "/replenishDeck", func: replenishDeck },
  { path: "/sendChat", func: sendChat },
  { path: "/startGame", func: startGame },
] as const;

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

export type { CollectCardsResult } from "./actions/collectCards.js";
export type { CreateGameResult } from "./actions/createGame.js";
export type { GetClientStateAndClearEventsResult } from "./actions/getClientStateAndClearEvents.js";
export type { GetEventsAndClearAcknowledgedResult } from "./actions/getEventsAndClearAcknowledged.js";
export type { GetJoinableGamesResult } from "./actions/getJoinableGames.js";
export type { JoinGameResult } from "./actions/joinGame.js";
export type { LeaveGameResult } from "./actions/leaveGame.js";
export type { PlayCardFaceDownResult } from "./actions/playCardFaceDown.js";
export type { PlayCardFaceUpResult } from "./actions/playCardFaceUp.js";
export type { ReplenishDeckResult } from "./actions/replenishDeck.js";
export type { SendChatResult } from "./actions/sendChat.js";
export type { StartGameResult } from "./actions/startGame.js";

export type {
  Card,
  ChatMessage,
  ClientState,
  GameEvent,
} from "../manager/index.js";

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

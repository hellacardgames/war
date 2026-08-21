export { Manager } from "./Manager.js";

export type {
  CollectCardsResult,
  CreateGameResult,
  GetClientStateAndClearEventsResult,
  GetEventsAndClearAcknowledgedResult,
  GetJoinableGamesResult,
  JoinGameResult,
  LeaveGameResult,
  PlayCardFaceDownResult,
  PlayCardFaceUpResult,
  ReplenishDeckResult,
  SendChatResult,
  StartGameResult,
} from "./Manager.js";

export type {
  Card,
  ChatMessage,
  ClientState,
  GameEvent,
} from "../game/index.js";

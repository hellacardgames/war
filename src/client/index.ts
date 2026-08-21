export { Client } from "./Client.js";

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
} from "./Client.js";

export type {
  Card,
  ChatMessage,
  ClientState,
  GameEvent,
} from "../game/index.js";

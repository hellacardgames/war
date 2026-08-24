import { Client } from "./Client.js";
export { Client };

export type CollectCardsResult = Awaited<ReturnType<Client["collectCards"]>>;
export type CreateGameResult = Awaited<ReturnType<Client["createGame"]>>;
export type GetClientStateAndClearEventsResult = Awaited<
  ReturnType<Client["getClientStateAndClearEvents"]>
>;
export type GetEventsAndClearAcknowledgedResult = Awaited<
  ReturnType<Client["getEventsAndClearAcknowledged"]>
>;
export type GetJoinableGamesResult = Awaited<
  ReturnType<Client["getJoinableGames"]>
>;
export type JoinGameResult = Awaited<ReturnType<Client["joinGame"]>>;
export type LeaveGameResult = Awaited<ReturnType<Client["leaveGame"]>>;
export type PlayCardFaceDownResult = Awaited<
  ReturnType<Client["playCardFaceDown"]>
>;
export type PlayCardFaceUpResult = Awaited<
  ReturnType<Client["playCardFaceUp"]>
>;
export type ReplenishDeckResult = Awaited<ReturnType<Client["replenishDeck"]>>;
export type SendChatResult = Awaited<ReturnType<Client["sendChat"]>>;
export type StartGameResult = Awaited<ReturnType<Client["startGame"]>>;

export type {
  Card,
  ChatMessage,
  ClientState,
  GameEvent,
} from "../game/index.js";

import { watchdog } from "./watchdog.js";

export { collectCards } from "./actions/collectCards.js";
export { createGame } from "./actions/createGame.js";
export { getClientStateAndClearEvents } from "./actions/getClientStateAndClearEvents.js";
export { getEventsAndClearAcknowledged } from "./actions/getEventsAndClearAcknowledged.js";
export { getJoinableGames } from "./actions/getJoinableGames.js";
export { joinGame } from "./actions/joinGame.js";
export { leaveGame } from "./actions/leaveGame.js";
export { playCardFaceDown } from "./actions/playCardFaceDown.js";
export { playCardFaceUp } from "./actions/playCardFaceUp.js";
export { replenishDeck } from "./actions/replenishDeck.js";
export { sendChat } from "./actions/sendChat.js";
export { startGame } from "./actions/startGame.js";

export type { Card } from "./types/Card.js";
export type { ChatMessage } from "./types/ChatMessage.js";
export type { ClientState } from "./types/ClientState.js";
export type { GameEvent } from "./types/GameEvent.js";

watchdog.start();

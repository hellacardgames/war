import { getClientStateAndClearEventsFactory } from "@hellacardgames/lib";
import type { ClientState } from "../types/ClientState.js";
import type { Game } from "../types/Game.js";

export const getClientStateAndClearEvents = getClientStateAndClearEventsFactory<
  Game,
  ClientState
>((game, player) => ({
  status: game.status,
  gameId: game.id,
  playerId: player.id,
  username: player.username,
  players: game.players.map((p) => ({
    username: p.username,
    deckSize: p.deck.length,
    capturePileSize: p.capturePile.length,
    battlePile: p.battlePile,
  })),
  expiresAt: game.expiresAt,
  chatMessages: game.chatMessages,
}));

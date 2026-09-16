import {
  getClientStateAndClearEventsFactory,
  requirePlayer,
} from "@hellacardgames/lib";
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
  adminUsername: requirePlayer(game, game.adminId).player.username,
  expiresAt: game.expiresAt,
  chatMessages: game.chatMessages,
}));

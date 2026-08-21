import type { ClientState } from "../types/ClientState.js";
import type { Game } from "../types/Game.js";

type GetClientStateAndClearEventsResult =
  | {
      readonly success: true;
      readonly state: ClientState;
      readonly game: Game;
    }
  | {
      readonly success: false;
      readonly error: "playerNotFound";
    };

export function getClientStateAndClearEvents(
  game: Game,
  playerId: string,
): GetClientStateAndClearEventsResult {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" };
  }
  const state: ClientState = {
    status: game.status,
    gameId: game.id,
    playerId,
    username: player.username,
    players: game.players.map((p) => ({
      username: p.username,
      deckSize: p.deck.length,
      capturePileSize: p.capturePile.length,
      battlePile: p.battlePile,
    })),
    expiresAt: game.expiresAt,
    chatMessages: game.chatMessages,
  };
  player.events.length = 0;
  return { success: true, state, game };
}

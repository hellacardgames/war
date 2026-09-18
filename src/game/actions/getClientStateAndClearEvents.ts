import {
  getClientStateAndClearEventsFactory,
  getPlayer,
  tryGetOtherPlayer,
} from "@hellacardgames/lib";
import type { ClientState } from "../types/ClientState.js";
import type { Game } from "../types/Game.js";

export const getClientStateAndClearEvents = getClientStateAndClearEventsFactory<
  Game,
  ClientState
>((game, player) => {
  const { otherPlayer } = tryGetOtherPlayer(game, player.id);

  return {
    status: game.status,
    gameId: game.id,
    playerId: player.id,
    player: {
      username: player.username,
      deckSize: player.deck.length,
      capturePileSize: player.capturePile.length,
      battlePile: player.battlePile,
    },
    otherPlayer: otherPlayer
      ? {
          username: otherPlayer.username,
          deckSize: otherPlayer.deck.length,
          capturePileSize: otherPlayer.capturePile.length,
          battlePile: otherPlayer.battlePile,
        }
      : null,
    adminUsername: getPlayer(game, game.adminId).player.username,
    expiresAt: game.expiresAt,
    chatMessages: game.chatMessages,
  };
});

import { createManagerFactory } from "@hellacardgames/lib";
import {
  collectCards,
  createGame,
  getClientStateAndClearEvents,
  getEventsAndClearAcknowledged,
  joinGame,
  leaveGame,
  MAX_PLAYERS,
  playCardFaceDown,
  playCardFaceUp,
  replenishDeck,
  startGame,
} from "../game/index.js";

export const createManager = createManagerFactory({
  maxPlayers: MAX_PLAYERS,
  createGame,
  getClientStateAndClearEvents,
  getEventsAndClearAcknowledged,
  joinGame,
  leaveGame,
  startGame,
  createCustomActions: (games) => ({
    collectCards: (gameId: string, playerId: string) => {
      const game = games.get(gameId);
      if (!game) {
        return { success: false, error: "gameNotFound" } as const;
      }
      if (game.status !== "started") {
        return { success: false, error: "invalidStatus" } as const;
      }
      const result = collectCards(game, playerId);
      if (!result.success) {
        return { success: false, error: result.error } as const;
      }
      games.set(gameId, result.game);
      return { success: true } as const;
    },
    playCardFaceDown: (gameId: string, playerId: string) => {
      const game = games.get(gameId);
      if (!game) {
        return { success: false, error: "gameNotFound" } as const;
      }
      if (game.status !== "started") {
        return { success: false, error: "invalidStatus" } as const;
      }
      const result = playCardFaceDown(game, playerId);
      if (!result.success) {
        return { success: false, error: result.error } as const;
      }
      games.set(gameId, result.game);
      return { success: true } as const;
    },
    playCardFaceUp: (gameId: string, playerId: string) => {
      const game = games.get(gameId);
      if (!game) {
        return { success: false, error: "gameNotFound" } as const;
      }
      if (game.status !== "started") {
        return { success: false, error: "invalidStatus" } as const;
      }
      const result = playCardFaceUp(game, playerId);
      if (!result.success) {
        return { success: false, error: result.error } as const;
      }
      games.set(gameId, result.game);
      return { success: true } as const;
    },
    replenishDeck: (gameId: string, playerId: string) => {
      const game = games.get(gameId);
      if (!game) {
        return { success: false, error: "gameNotFound" } as const;
      }
      if (game.status !== "started") {
        return { success: false, error: "invalidStatus" } as const;
      }
      const result = replenishDeck(game, playerId);
      if (!result.success) {
        return { success: false, error: result.error } as const;
      }
      games.set(gameId, result.game);
      return { success: true } as const;
    },
  }),
});

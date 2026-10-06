import type { ClientState, GameEvent } from "../client/index.js";

export function applyEvent(
  previousState: ClientState,
  event: GameEvent,
): ClientState {
  switch (event.type) {
    case "adminChanged":
      return {
        ...previousState,
        adminUsername: event.username,
      };
    case "chat":
      return {
        ...previousState,
        chatMessages: [...previousState.chatMessages, event.message],
      };
    case "expirationUpdated":
      return { ...previousState, expiresAt: event.expiresAt };
    case "gameCompleted":
      return {
        ...previousState,
        status: "completed",
        gameWinnerUsername: event.gameWinnerUsername,
      };
    case "gameForfeited":
      return { ...previousState, status: "forfeited" };
    case "gameStarted":
      return { ...previousState, status: "started" };
    case "otherPlayerCollectedCards":
      return {
        ...previousState,
        otherPlayer: previousState.otherPlayer
          ? {
              ...previousState.otherPlayer,
              battlePile: [],
              capturePileSize:
                previousState.otherPlayer.capturePileSize + event.numCards,
              roundWinner: false,
            }
          : null,
        player: {
          ...previousState.player,
          battlePile: [],
        },
      };
    case "otherPlayerDeckInitialized":
      return {
        ...previousState,
        otherPlayer: previousState.otherPlayer
          ? {
              ...previousState.otherPlayer,
              deckSize: event.numCards,
            }
          : null,
      };
    case "otherPlayerDeckReplenished":
      return {
        ...previousState,
        otherPlayer: previousState.otherPlayer
          ? {
              ...previousState.otherPlayer,
              deckSize: event.numCards,
              capturePileSize: 0,
            }
          : null,
      };
    case "otherPlayerJoined":
      return {
        ...previousState,
        otherPlayer: {
          username: event.username,
          deckSize: 0,
          capturePileSize: 0,
          battlePile: [],
          roundWinner: false,
        },
      };
    case "otherPlayerLeft":
      return {
        ...previousState,
        otherPlayer: null,
      };
    case "otherPlayerPlayedCard":
      return {
        ...previousState,
        otherPlayer: previousState.otherPlayer
          ? {
              ...previousState.otherPlayer,
              battlePile: [...previousState.otherPlayer.battlePile, event.card],
              deckSize: previousState.otherPlayer.deckSize - 1,
            }
          : null,
      };
    case "otherPlayerWonRound":
      return {
        ...previousState,
        otherPlayer: previousState.otherPlayer
          ? {
              ...previousState.otherPlayer,
              roundWinner: true,
            }
          : null,
      };
    case "playerAvailableActionsSet":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          canPlayCardFaceUp: event.canPlayCardFaceUp,
          canPlayCardFaceDown: event.canPlayCardFaceDown,
          canReplenishDeck: event.canReplenishDeck,
        },
      };
    case "playerCollectedCards":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          battlePile: [],
          capturePileSize:
            previousState.player.capturePileSize + event.numCards,
          roundWinner: false,
        },
        otherPlayer: previousState.otherPlayer
          ? {
              ...previousState.otherPlayer,
              battlePile: [],
            }
          : null,
      };
    case "playerDeckInitialized":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          deckSize: event.numCards,
        },
      };
    case "playerDeckReplenished":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          deckSize: event.numCards,
          capturePileSize: 0,
        },
      };
    case "playerPlayedCard":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          battlePile: [...previousState.player.battlePile, event.card],
          deckSize: previousState.player.deckSize - 1,
        },
      };
    case "playerWonRound":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          roundWinner: true,
        },
      };
  }
}

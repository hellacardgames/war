import type { createServer } from "../server/index.js";

type Server = ReturnType<typeof createServer>;

type ServerResult<
  TServer extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actions: readonly { path: string; action: (...args: any[]) => any }[];
  },
  TPath extends TServer["actions"][number]["path"],
> = ReturnType<Extract<TServer["actions"][number], { path: TPath }>["action"]>;

export class Client {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async collectCards(gameId: string, playerId: string) {
    const response = await fetch(`${this.baseUrl}/collectCards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result: ServerResult<Server, "/collectCards"> = await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async createGame(accessToken: string) {
    const response = await fetch(`${this.baseUrl}/createGame`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result: ServerResult<Server, "/createGame"> = await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async getClientStateAndClearEvents(gameId: string, playerId: string) {
    const response = await fetch(
      `${this.baseUrl}/getClientStateAndClearEvents`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId, playerId }),
      },
    );
    const result: ServerResult<Server, "/getClientStateAndClearEvents"> =
      await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async getEventsAndClearAcknowledged(
    gameId: string,
    playerId: string,
    lastReadId: string | null,
  ) {
    const response = await fetch(
      `${this.baseUrl}/getEventsAndClearAcknowledged`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId, playerId, lastReadId }),
      },
    );
    const result: ServerResult<Server, "/getEventsAndClearAcknowledged"> =
      await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async getJoinableGames() {
    const response = await fetch(`${this.baseUrl}/getJoinableGames`, {
      method: "POST",
    });
    const result: ServerResult<Server, "/getJoinableGames"> =
      await response.json();
    return result;
  }

  async joinGame(gameId: string, accessToken: string) {
    const response = await fetch(`${this.baseUrl}/joinGame`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId }),
    });
    const result: ServerResult<Server, "/joinGame"> = await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async leaveGame(gameId: string, playerId: string) {
    const response = await fetch(`${this.baseUrl}/leaveGame`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result: ServerResult<Server, "/leaveGame"> = await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async playCardFaceDown(gameId: string, playerId: string) {
    const response = await fetch(`${this.baseUrl}/playCardFaceDown`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result: ServerResult<Server, "/playCardFaceDown"> =
      await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async playCardFaceUp(gameId: string, playerId: string) {
    const response = await fetch(`${this.baseUrl}/playCardFaceUp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result: ServerResult<Server, "/playCardFaceUp"> =
      await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async replenishDeck(gameId: string, playerId: string) {
    const response = await fetch(`${this.baseUrl}/replenishDeck`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result: ServerResult<Server, "/replenishDeck"> =
      await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async sendChat(gameId: string, playerId: string, text: string) {
    const response = await fetch(`${this.baseUrl}/sendChat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId, text }),
    });
    const result: ServerResult<Server, "/sendChat"> = await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async startGame(gameId: string, playerId: string) {
    const response = await fetch(`${this.baseUrl}/startGame`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result: ServerResult<Server, "/startGame"> = await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }
}

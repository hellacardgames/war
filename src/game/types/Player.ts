import type { Card } from "./Card.js";
import type { GameEvent } from "./GameEvent.js";

export type Player = {
  readonly id: string;
  readonly userId: string;
  readonly username: string;
  readonly events: readonly GameEvent[];
  readonly deck: readonly Card[];
  readonly capturePile: readonly Card[];
  readonly battlePile: readonly Card[];
};

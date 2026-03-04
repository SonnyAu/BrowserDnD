export type TerrainTile = "#" | "." | "D" | "S";
export type EntityTile = "P" | "E" | "N" | "B" | " ";
export type ItemTile = "T" | "W" | "A" | "K" | " ";

export type Direction = "up" | "down" | "left" | "right";

export type EventType = "enemyEncounter" | "itemPickup" | "none";

export interface Dungeon {
  width: number;
  height: number;
  terrain: string;
  entities: string;
  items: string;
  visited: Set<number>;
}

export interface MoveResult {
  dungeon: Dungeon;
  terrainTile: string;
  entityTile: string;
  itemTile: string;
  event: EventType;
}

export interface ItemData {
  name: string;
  type: string;
  value?: number;
  attack?: number;
  defense?: number;
}

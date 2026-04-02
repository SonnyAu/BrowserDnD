export type TerrainTile = "#" | "." | "D" | "S";
export type EntityTile = "P" | "E" | "N" | "B" | " ";
export type ItemTile = "T" | "W" | "A" | "K" | " ";

export type Direction = "up" | "down" | "left" | "right";

export type EventType = "enemyEncounter" | "itemPickup" | "npcInteract" | "none";

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
  id: string;
  name: string;
  type: "weapon" | "armor" | "consumable" | "treasure" | "key";
  value?: number;
  attack?: number;
  defense?: number;
}

export interface Equipment {
  helmet: ItemData | null;
  chest: ItemData | null;
  mainWeapon: ItemData | null;
  sideWeapon: ItemData | null;
  pants: ItemData | null;
}

export interface PlayerState {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  xp: number;
  maxXp: number;
  gold: number;
  attack: number;
  defense: number;
  inventory: ItemData[];
  equipment: Equipment;
}

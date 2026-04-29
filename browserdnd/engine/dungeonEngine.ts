import { Dungeon, Direction, MoveResult } from "./types";
import { parseDungeon } from "./mapParser";
import { movePlayer } from "./movement";

export { parseDungeon } from "./mapParser";
export { movePlayer } from "./movement";
export { getVisibleMap } from "./fog";
export { getItemData, items } from "./items";
export { coordsToIndex, indexToCoords, getNeighbors } from "./mapParser";
export type { Dungeon, Direction, MoveResult, EventType, ItemData } from "./types";

const sampleTerrain =
  "##########" +
  "#........#" +
  "#..##....#" +
  "#....#...#" +
  "#........#" +
  "##########";

const sampleEntities =
  "          " +
  " E  E     " +
  "   N   E  " +
  "      E   " +
  "    P     " +
  "  E       ";

const sampleItems =
  "          " +
  "   H  T   " +
  "    A     " +
  "   W   K  " +
  "     H    " +
  "          ";

const SAMPLE_WIDTH = 10;

export function createDungeon(): Dungeon {
  return parseDungeon(sampleTerrain, sampleEntities, sampleItems, SAMPLE_WIDTH);
}

const keyDirectionMap: Record<string, Direction> = {
  w: "up",
  a: "left",
  s: "down",
  d: "right",
  arrowup: "up",
  arrowleft: "left",
  arrowdown: "down",
  arrowright: "right",
};

export function handleMovementInput(
  key: string,
  dungeon: Dungeon
): MoveResult | null {
  const direction = keyDirectionMap[key.toLowerCase()];
  if (!direction) {
    return null;
  }
  return movePlayer(dungeon, direction);
}

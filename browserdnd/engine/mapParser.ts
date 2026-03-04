import { Dungeon } from "./types";

export function coordsToIndex(x: number, y: number, width: number): number {
  return y * width + x;
}

export function indexToCoords(
  index: number,
  width: number
): { x: number; y: number } {
  return {
    x: index % width,
    y: Math.floor(index / width),
  };
}

export function getNeighbors(
  index: number,
  width: number
): { up: number; down: number; left: number; right: number } {
  return {
    up: index - width,
    down: index + width,
    left: index - 1,
    right: index + 1,
  };
}

export function parseDungeon(
  terrainString: string,
  entityString: string,
  itemString: string,
  width: number
): Dungeon {
  const height = terrainString.length / width;

  const playerIndex = entityString.indexOf("P");

  const visited = new Set<number>();
  if (playerIndex !== -1) {
    visited.add(playerIndex);
  }

  return {
    width,
    height,
    terrain: terrainString,
    entities: entityString,
    items: itemString,
    visited,
  };
}

import { Dungeon } from "./types";

export function getVisibleMap(dungeon: Dungeon): string[][] {
  const { width, height, terrain, entities, items, visited } = dungeon;
  const grid: string[][] = [];

  for (let y = 0; y < height; y++) {
    const row: string[] = [];
    for (let x = 0; x < width; x++) {
      const index = y * width + x;

      if (!visited.has(index)) {
        row.push("?");
        continue;
      }

      const entityChar = entities[index];
      const itemChar = items[index];
      const terrainChar = terrain[index];

      if (entityChar === "P") {
        row.push("P");
      } else if (entityChar !== " ") {
        row.push(entityChar);
      } else if (itemChar !== " ") {
        row.push(itemChar);
      } else {
        row.push(terrainChar);
      }
    }
    grid.push(row);
  }

  return grid;
}

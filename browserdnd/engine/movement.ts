import { Dungeon, Direction, MoveResult, EventType } from "./types";
import { indexToCoords, coordsToIndex } from "./mapParser";

function replaceCharAt(str: string, index: number, char: string): string {
  return str.substring(0, index) + char + str.substring(index + 1);
}

export function movePlayer(dungeon: Dungeon, direction: Direction): MoveResult {
  const playerIndex = dungeon.entities.indexOf("P");
  const { x, y } = indexToCoords(playerIndex, dungeon.width);

  let newX = x;
  let newY = y;

  switch (direction) {
    case "up":
      newY = y - 1;
      break;
    case "down":
      newY = y + 1;
      break;
    case "left":
      newX = x - 1;
      break;
    case "right":
      newX = x + 1;
      break;
  }

  if (newX < 0 || newX >= dungeon.width || newY < 0 || newY >= dungeon.height) {
    return {
      dungeon,
      terrainTile: dungeon.terrain[playerIndex],
      entityTile: "P",
      itemTile: dungeon.items[playerIndex],
      event: "none",
      targetIndex: playerIndex,
    };
  }

  const newIndex = coordsToIndex(newX, newY, dungeon.width);
  const terrainTile = dungeon.terrain[newIndex];
  const entityTile = dungeon.entities[newIndex];
  const itemTile = dungeon.items[newIndex];

  // NPCs block movement but trigger an interaction on bump. Mark the NPC's
  // tile as visited so it becomes visible to the player even if they never
  // step on it.
  if (entityTile === "N") {
    const newVisited = new Set(dungeon.visited);
    newVisited.add(newIndex);
    return {
      dungeon: { ...dungeon, visited: newVisited },
      terrainTile,
      entityTile,
      itemTile,
      event: "npcInteract",
      targetIndex: newIndex,
    };
  }

  if (terrainTile === "#") {
    return {
      dungeon,
      terrainTile,
      entityTile,
      itemTile,
      event: "none",
      targetIndex: newIndex,
    };
  }

  let event: EventType = "none";

  if (entityTile === "E") {
    event = "enemyEncounter";
  } else if (itemTile !== " ") {
    event = "itemPickup";
  }

  let newEntities = replaceCharAt(dungeon.entities, playerIndex, " ");
  newEntities = replaceCharAt(newEntities, newIndex, "P");

  let newItems = dungeon.items;
  if (itemTile !== " ") {
    newItems = replaceCharAt(newItems, newIndex, " ");
  }

  const newVisited = new Set(dungeon.visited);
  newVisited.add(newIndex);

  const newDungeon: Dungeon = {
    ...dungeon,
    entities: newEntities,
    items: newItems,
    visited: newVisited,
  };

  return {
    dungeon: newDungeon,
    terrainTile,
    entityTile,
    itemTile,
    event,
    targetIndex: newIndex,
  };
}

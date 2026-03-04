import { ItemData } from "./types";

export const items: Record<string, ItemData> = {
  T: {
    name: "Gold Pouch",
    type: "treasure",
    value: 50,
  },
  W: {
    name: "Iron Sword",
    type: "weapon",
    attack: 5,
  },
  A: {
    name: "Leather Armor",
    type: "armor",
    defense: 3,
  },
  K: {
    name: "Dungeon Key",
    type: "key",
  },
};

export function getItemData(tile: string): ItemData | null {
  return items[tile] ?? null;
}

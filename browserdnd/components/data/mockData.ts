import type { PlayerState } from "@/engine/types";

// Initial player state — source of truth for GameLayout
export const initialPlayerState: PlayerState = {
  name: "Aldric",
  level: 5,
  hp: 78,
  maxHp: 100,
  mp: 35,
  maxMp: 50,
  xp: 2400,
  maxXp: 3000,
  gold: 342,
  attack: 12,
  defense: 6,
  inventory: [],
  equipment: {
    helmet: null,
    chest: null,
    mainWeapon: null,
    sideWeapon: null,
    pants: null,
  },
};

export type EquipmentSlot = {
  name: string;
  icon: string;
  position: "top" | "left" | "center" | "right" | "bottom";
};

export const equipmentSlots: EquipmentSlot[] = [
  { name: "Helmet", icon: "🪖", position: "top" },
  { name: "Side Weapon", icon: "🛡️", position: "left" },
  { name: "Chest Armor", icon: "🦺", position: "center" },
  { name: "Main Weapon", icon: "⚔️", position: "right" },
  { name: "Pants", icon: "👖", position: "bottom" },
];

export type ActionMode = "default" | "combat" | "loot" | "dialogue";

export const actionButtons: Record<ActionMode, string[]> = {
  default: ["Explore", "Inventory", "Character", "Rest", "Interact"],
  combat: ["Attack", "Defend", "Skill", "Item", "Run"],
  loot: ["Pick Up", "Leave"],
  dialogue: ["Talk", "Trade", "Leave"],
};

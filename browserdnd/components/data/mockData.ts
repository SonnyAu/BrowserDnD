export const characterData = {
  name: "Aldric",
  level: 5,
  hp: { current: 78, max: 100 },
  mp: { current: 35, max: 50 },
  xp: { current: 2400, max: 3000 },
  gold: 342,
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

export const eventLogMessages = [
  { id: 1, text: "You enter a dark hallway." },
  { id: 2, text: "The air smells of damp stone and iron." },
  { id: 3, text: "You hear footsteps echoing ahead." },
  { id: 4, text: "A goblin appears." },
  { id: 5, text: 'Goblin: "Your gold or your life."' },
];

export type TileType =
  | "player"
  | "enemy"
  | "treasure"
  | "wall"
  | "empty"
  | "unexplored";

export const dungeonGrid: TileType[][] = [
  ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
  ["wall", "empty", "empty", "empty", "wall", "empty", "empty", "empty", "treasure", "wall"],
  ["wall", "empty", "wall", "empty", "wall", "empty", "wall", "empty", "empty", "wall"],
  ["wall", "empty", "wall", "empty", "empty", "empty", "wall", "empty", "wall", "wall"],
  ["wall", "empty", "empty", "empty", "wall", "empty", "empty", "empty", "empty", "wall"],
  ["wall", "wall", "empty", "wall", "wall", "empty", "wall", "wall", "empty", "wall"],
  ["wall", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "wall"],
  ["wall", "empty", "wall", "enemy", "wall", "empty", "wall", "empty", "wall", "wall"],
  ["wall", "player", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "wall"],
  ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
];

export type ActionMode = "default" | "dialogue" | "combat";

export const actionButtons: Record<ActionMode, string[]> = {
  default: ["Explore", "Inventory", "Character", "Rest", "Interact"],
  dialogue: ["Ask about dungeon", "Trade", "Leave"],
  combat: ["Attack", "Skill", "Item", "Defend", "Run"],
};

import { PlayerState, ItemData } from "./types";

export interface Enemy {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
}

export interface CombatState {
  enemy: Enemy;
  active: boolean;
  playerTurn: boolean;
  defending: boolean;
}

function clamp(value: number, min = 0) {
  return Math.max(min, value);
}

export function createEnemy(name = "Dungeon Raider"): Enemy {
  return { name, hp: 24, maxHp: 24, attack: 8, defense: 3 };
}

export function attackEnemy(player: PlayerState, enemy: Enemy): { enemy: Enemy; damage: number } {
  const damage = Math.max(1, player.attack - enemy.defense);
  return { enemy: { ...enemy, hp: clamp(enemy.hp - damage) }, damage };
}

export function enemyAttackPlayer(
  player: PlayerState,
  enemy: Enemy,
  defending = false
): { player: PlayerState; damage: number } {
  const reduced = defending ? Math.floor(enemy.attack / 2) : enemy.attack;
  const damage = Math.max(1, reduced - player.defense);
  return { player: { ...player, hp: clamp(player.hp - damage) }, damage };
}

export function consumeConsumable(player: PlayerState, item: ItemData): { player: PlayerState; message: string } {
  if (item.type !== "consumable") {
    return { player, message: `${item.name} cannot be used right now.` };
  }

  const heal = item.value ?? 20;
  const nextHp = Math.min(player.maxHp, player.hp + heal);
  return {
    player: { ...player, hp: nextHp, inventory: player.inventory.filter((i) => i.id !== item.id) },
    message: `You use ${item.name} and recover ${nextHp - player.hp} HP.`,
  };
}

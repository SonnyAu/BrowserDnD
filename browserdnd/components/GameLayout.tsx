"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import CharacterPanel from "./CharacterPanel";
import EventLog from "./EventLog";
import DungeonMap from "./DungeonMap";
import ActionMenu from "./ActionMenu";
import FuturePanel from "./FuturePanel";
import { createDungeon, getVisibleMap, handleMovementInput } from "@/engine/dungeonEngine";
import { PlayerState, ItemData, Equipment } from "@/engine/types";
import { ActionMode, initialPlayerState } from "./data/mockData";
import { CombatState, createEnemy, attackEnemy, enemyAttackPlayer, consumeConsumable } from "@/engine/combat";

const TILE_ITEMS: Record<string, Omit<ItemData, "id">> = {
  T: { name: "Ancient Relic", type: "treasure", value: 50 },
  W: { name: "Iron Sword", type: "weapon", attack: 8 },
  A: { name: "Leather Armor", type: "armor", defense: 4 },
  K: { name: "Old Key", type: "key" },
  H: { name: "Healing Draught", type: "consumable", value: 25 },
};

type DialogueState = { stage: "intro" | "oath"; resolved: boolean } | null;

const EQUIP_SLOT_MAP: Record<string, keyof Equipment> = {
  Helmet: "helmet",
  "Side Weapon": "sideWeapon",
  "Chest Armor": "chest",
  "Main Weapon": "mainWeapon",
  Pants: "pants",
};

export default function GameLayout() {
  const [dungeon, setDungeon] = useState(() => createDungeon());
  const [player, setPlayer] = useState<PlayerState>(initialPlayerState);
  const [messages, setMessages] = useState([{ id: 0, text: "You cross the Narrow Sea. Use WASD or arrow keys to march." }]);
  const [actionMode, setActionMode] = useState<ActionMode>("default");
  const [pendingItem, setPendingItem] = useState<ItemData | null>(null);
  const [combatState, setCombatState] = useState<CombatState | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [dialogueState, setDialogueState] = useState<DialogueState>(null);
  const msgIdRef = useRef(1);

  const addMessage = (text: string) => setMessages((prev) => [...prev, { id: msgIdRef.current++, text }]);

  const recalcCombatStats = (next: PlayerState): PlayerState => {
    const baseAtk = 12;
    const baseDef = 6;
    return {
      ...next,
      attack: baseAtk + (next.equipment.mainWeapon?.attack ?? 0) + (next.equipment.sideWeapon?.attack ?? 0),
      defense: baseDef + (next.equipment.helmet?.defense ?? 0) + (next.equipment.chest?.defense ?? 0) + (next.equipment.pants?.defense ?? 0) + (next.equipment.sideWeapon?.defense ?? 0),
    };
  };

  const handleAction = useCallback((action: string) => {
    switch (action) {
      case "Inventory":
        setShowInventory((v) => !v);
        addMessage(showInventory ? "You close your satchel." : "You open your satchel.");
        return;
      case "Pick Up":
        if (pendingItem) {
          setPlayer((p) => ({ ...p, inventory: [...p.inventory, pendingItem] }));
          addMessage(`${pendingItem.name} added to inventory.`);
          setPendingItem(null);
          setActionMode("default");
        }
        return;
      case "Leave":
        if (actionMode === "dialogue") {
          setDialogueState(null);
          addMessage("You end the conversation.");
        } else if (actionMode === "loot") {
          setPendingItem(null);
          addMessage("You leave it behind.");
        }
        setActionMode("default");
        return;
      case "Attack": {
        if (!combatState || gameOver) return;
        const swing = attackEnemy(player, combatState.enemy);
        addMessage(`You strike ${combatState.enemy.name} for ${swing.damage}.`);
        if (swing.enemy.hp <= 0) {
          addMessage(`${swing.enemy.name} is slain.`);
          setCombatState(null);
          setActionMode("default");
          return;
        }
        const retaliation = enemyAttackPlayer(player, swing.enemy, false);
        setPlayer(retaliation.player);
        addMessage(`${swing.enemy.name} counters for ${retaliation.damage}.`);
        setCombatState({ ...combatState, enemy: swing.enemy });
        if (retaliation.player.hp <= 0) {
          setGameOver(true);
          addMessage("You fall in battle. Game over.");
          setActionMode("default");
          setCombatState(null);
        }
        return;
      }
      case "Defend": {
        if (!combatState || gameOver) return;
        const retaliation = enemyAttackPlayer(player, combatState.enemy, true);
        setPlayer(retaliation.player);
        addMessage(`You brace for impact. ${combatState.enemy.name} deals ${retaliation.damage}.`);
        if (retaliation.player.hp <= 0) {
          setGameOver(true);
          addMessage("You fall in battle. Game over.");
          setActionMode("default");
          setCombatState(null);
        }
        return;
      }
      case "Item": {
        if (!combatState) return;
        const consumable = player.inventory.find((i) => i.type === "consumable");
        if (!consumable) {
          addMessage("No consumable available.");
          return;
        }
        const used = consumeConsumable(player, consumable);
        setPlayer(used.player);
        addMessage(used.message);
        return;
      }
      case "Run":
        if (!combatState) return;
        if (Math.random() < 0.5) {
          addMessage("You retreat from battle.");
          setCombatState(null);
          setActionMode("default");
        } else {
          addMessage("You fail to escape!");
        }
        return;
      case "Talk":
        if (dialogueState?.stage === "intro") {
          addMessage("Envoy: 'Will you uphold your oath and guard the roads?' (Talk=Yes, Trade=No)");
          setDialogueState({ stage: "oath", resolved: false });
        } else if (dialogueState?.stage === "oath") {
          setPlayer((p) => ({ ...p, gold: p.gold + 40 }));
          addMessage("Envoy: 'Honor rewarded.' You gain 40 gold.");
          setDialogueState({ stage: "oath", resolved: true });
          setActionMode("default");
        }
        return;
      case "Trade":
        if (dialogueState?.stage === "intro") {
          addMessage("Envoy: 'Coin first, favors later.' (Talk=Accept, Trade=Refuse)");
          setDialogueState({ stage: "oath", resolved: false });
        } else if (dialogueState?.stage === "oath") {
          setPlayer((p) => ({ ...p, hp: Math.max(1, p.hp - 12) }));
          addMessage("The envoy's guards rough you up. You lose 12 HP.");
          setDialogueState({ stage: "oath", resolved: true });
          setActionMode("default");
        }
        return;
      default:
        addMessage(`[${action}] — not yet implemented.`);
    }
  }, [pendingItem, combatState, player, gameOver, showInventory, actionMode, dialogueState]);

  const handleEquipmentSlotClick = (slotName: string) => {
    if (!showInventory || !selectedInventoryId) return;
    setPlayer((prev) => {
      const selected = prev.inventory.find((item) => item.id === selectedInventoryId);
      if (!selected) return prev;
      const slotKey = EQUIP_SLOT_MAP[slotName];
      if (!slotKey) return prev;
      const valid = (slotKey === "mainWeapon" || slotKey === "sideWeapon") ? selected.type === "weapon" : selected.type === "armor";
      if (!valid) {
        addMessage(`${selected.name} does not fit ${slotName}.`);
        return prev;
      }
      const outgoing = prev.equipment[slotKey];
      const equipment = { ...prev.equipment, [slotKey]: selected };
      const inventory = prev.inventory.filter((i) => i.id !== selected.id);
      if (outgoing) inventory.push(outgoing);
      addMessage(`Equipped ${selected.name} to ${slotName}.`);
      return recalcCombatStats({ ...prev, equipment, inventory });
    });
    setSelectedInventoryId(null);
  };

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (actionMode !== "default" || gameOver) return;
    const result = handleMovementInput(e.key, dungeon);
    if (!result) return;
    setDungeon(result.dungeon);
    if (result.event === "enemyEncounter") {
      addMessage("Steel is drawn — a foe approaches.");
      setCombatState({ enemy: createEnemy(), active: true, playerTurn: true, defending: false });
      setActionMode("combat");
    } else if (result.event === "itemPickup") {
      const base = TILE_ITEMS[result.itemTile];
      if (!base) return;
      const item: ItemData = { ...base, id: `${result.itemTile}-${msgIdRef.current}` };
      setPendingItem(item);
      addMessage(`You find a ${item.name}.`);
      setActionMode("loot");
    } else if (result.event === "npcInteract") {
      addMessage("Envoy: 'State your business, traveler.' (Talk or Trade)");
      setDialogueState({ stage: "intro", resolved: false });
      setActionMode("dialogue");
    }
  }, [dungeon, actionMode, gameOver]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div className="grid h-screen w-screen grid-cols-[300px_1fr_350px] grid-rows-[2fr_1fr] gap-2 overflow-hidden bg-[#090909] p-2 text-[#e8d9b5]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(127,29,29,0.2),transparent_35%),radial-gradient(circle_at_90%_5%,rgba(146,120,62,0.12),transparent_30%)]" />
      <div className="relative row-span-2"><CharacterPanel player={player} onEquipmentSlotClick={handleEquipmentSlotClick} /></div>
      <div className="relative"><EventLog messages={messages} /></div>
      <div className="relative"><DungeonMap grid={getVisibleMap(dungeon)} /></div>
      <div className="relative"><ActionMenu mode={actionMode} onAction={handleAction} /></div>
      <div className="relative"><FuturePanel inventory={player.inventory} showInventory={showInventory} selectedInventoryId={selectedInventoryId} onSelectItem={setSelectedInventoryId} /></div>
    </div>
  );
}

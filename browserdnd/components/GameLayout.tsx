"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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

type DialogueState = { stage: "intro" | "question"; npcName: string } | null;

const EQUIP_SLOT_MAP: Record<string, keyof Equipment> = {
  Helmet: "helmet",
  "Side Weapon": "sideWeapon",
  "Chest Armor": "chest",
  "Main Weapon": "mainWeapon",
  Pants: "pants",
};

const COUNSELOR_GIFT: Omit<ItemData, "id"> = { name: "Counselor's Sigil Blade", type: "weapon", attack: 14 };

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
  const [exploredTiles, setExploredTiles] = useState<Set<number>>(() => new Set());
  const [canInteract, setCanInteract] = useState(false);
  const [activeNpcTile, setActiveNpcTile] = useState<number | null>(null);
  const [foundNpcTiles, setFoundNpcTiles] = useState<Set<number>>(() => new Set());
  const msgIdRef = useRef(1);

  const addMessage = (text: string) => setMessages((prev) => [...prev, { id: msgIdRef.current++, text }]);

  const markNpcAsFound = useCallback(() => {
    if (activeNpcTile === null) return;
    setFoundNpcTiles((prev) => new Set(prev).add(activeNpcTile));
    setActiveNpcTile(null);
    setCanInteract(false);
  }, [activeNpcTile]);

  const mapGrid = useMemo(() => {
    const baseGrid = getVisibleMap(dungeon);
    foundNpcTiles.forEach((index) => {
      if (!dungeon.visited.has(index)) return;
      const x = index % dungeon.width;
      const y = Math.floor(index / dungeon.width);
      if (baseGrid[y]?.[x] && baseGrid[y][x] !== "P") {
        baseGrid[y][x] = "F";
      }
    });
    return baseGrid;
  }, [dungeon, foundNpcTiles]);

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
      case "Explore": {
        const playerIndex = dungeon.entities.indexOf("P");
        if (exploredTiles.has(playerIndex)) {
          addMessage("You've already explored this tile.");
          return;
        }
        setExploredTiles((prev) => new Set(prev).add(playerIndex));
        const roll = Math.random();
        if (roll < 0.35) {
          const foundItem: ItemData = { ...TILE_ITEMS.H, id: `explore-${msgIdRef.current}` };
          setPlayer((p) => ({ ...p, inventory: [...p.inventory, foundItem] }));
          addMessage(`Exploration reward: ${foundItem.name} added to your inventory.`);
        } else if (roll < 0.7) {
          addMessage("You search the area but find nothing useful.");
        } else {
          addMessage("Your exploration attracts an ambush!");
          setCombatState({ enemy: createEnemy(), active: true, playerTurn: true, defending: false });
          setActionMode("combat");
        }
        return;
      }
      case "Interact":
        if (!canInteract) {
          addMessage("No one here to interact with.");
          return;
        }
        addMessage("Council Envoy: 'One answer decides your fate. Loyalty or greed?' (Talk=Loyalty, Trade=Greed)");
        setDialogueState({ stage: "intro", npcName: "Council Envoy" });
        setActionMode("dialogue");
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
          markNpcAsFound();
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
          const rewardItem: ItemData = { ...COUNSELOR_GIFT, id: `npc-${msgIdRef.current}` };
          setPlayer((p) => ({ ...p, inventory: [...p.inventory, rewardItem], gold: p.gold + 30 }));
          addMessage("Envoy: 'Wise answer.' You gain 30 gold and a Counselor's Sigil Blade.");
          setDialogueState(null);
          markNpcAsFound();
          setActionMode("default");
        }
        return;
      case "Trade":
        if (dialogueState?.stage === "intro") {
          addMessage("Envoy: 'Then draw steel.' The envoy attacks!");
          setDialogueState(null);
          markNpcAsFound();
          setCombatState({ enemy: createEnemy(), active: true, playerTurn: true, defending: false });
          setActionMode("combat");
        }
        return;
      default:
        addMessage(`[${action}] — not yet implemented.`);
    }
  }, [pendingItem, combatState, player, gameOver, showInventory, actionMode, dialogueState, exploredTiles, canInteract, dungeon.entities, markNpcAsFound]);

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

  const handleInventoryUse = (itemId: string) => {
    setPlayer((prev) => {
      const selected = prev.inventory.find((item) => item.id === itemId);
      if (!selected) return prev;
      if (selected.type === "consumable") {
        const used = consumeConsumable(prev, selected);
        addMessage(used.message);
        return used.player;
      }
      if (selected.type === "weapon" || selected.type === "armor") {
        const slotKey: keyof Equipment = selected.type === "weapon" ? "mainWeapon" : "chest";
        const outgoing = prev.equipment[slotKey];
        const equipment = { ...prev.equipment, [slotKey]: selected };
        const inventory = prev.inventory.filter((i) => i.id !== selected.id);
        if (outgoing) inventory.push(outgoing);
        addMessage(`Equipped ${selected.name}.`);
        return recalcCombatStats({ ...prev, equipment, inventory });
      }
      addMessage(`${selected.name} cannot be used right now.`);
      return prev;
    });
  };

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (actionMode !== "default" || gameOver) return;
    const result = handleMovementInput(e.key, dungeon);
    if (!result) return;
    setDungeon(result.dungeon);
    setCanInteract(result.entityTile === "N");
    if (result.event === "npcInteract") {
      const playerIndex = result.dungeon.entities.indexOf("P");
      setActiveNpcTile(playerIndex);
      addMessage("You encounter a Council Envoy.");
      addMessage("Council Envoy: 'One answer decides your fate. Loyalty or greed?' (Talk=Loyalty, Trade=Greed)");
      setDialogueState({ stage: "intro", npcName: "Council Envoy" });
      setActionMode("dialogue");
      return;
    }
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
    }
  }, [dungeon, actionMode, gameOver]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const motePositions = [
    { left: "8%",  top: "22%", duration: "14s", delay: "0s"   },
    { left: "19%", top: "55%", duration: "18s", delay: "2.1s" },
    { left: "33%", top: "35%", duration: "12s", delay: "4.4s" },
    { left: "48%", top: "18%", duration: "20s", delay: "1.2s" },
    { left: "62%", top: "60%", duration: "16s", delay: "3.7s" },
    { left: "75%", top: "42%", duration: "22s", delay: "0.8s" },
    { left: "87%", top: "28%", duration: "13s", delay: "5.5s" },
    { left: "93%", top: "70%", duration: "17s", delay: "2.9s" },
  ];

  return (
    <div
      className="grid h-screen w-screen grid-cols-[300px_1fr_350px] grid-rows-[2fr_1fr] gap-2 overflow-hidden p-2 text-foreground"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #1a1208 0%, #0b0a08 55%)" }}
    >
      {/* Stone keep atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <svg className="absolute inset-0 w-full h-full opacity-[0.022]">
          <filter id="stone-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#stone-grain)" />
        </svg>
        <div
          className="torch-glow absolute"
          style={{
            top: "-10%", left: "-5%",
            width: "340px", height: "340px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(210,100,18,0.28) 0%, transparent 70%)",
          }}
        />
        <div
          className="torch-glow absolute"
          style={{
            top: "-10%", right: "-5%",
            width: "300px", height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(180,120,28,0.22) 0%, transparent 70%)",
            animationDelay: "3.6s",
          }}
        />
        {motePositions.map((m, i) => (
          <div
            key={i}
            className="dust-mote"
            style={{ left: m.left, top: m.top, animationDuration: m.duration, animationDelay: m.delay }}
          />
        ))}
      </div>

      {/* Panels — grid structure locked */}
      <div className="relative row-span-2 min-h-0 overflow-hidden z-10">
        <CharacterPanel player={player} onEquipmentSlotClick={handleEquipmentSlotClick} />
      </div>
      <div className="relative min-h-0 min-w-0 overflow-hidden z-10">
        <EventLog messages={messages} />
      </div>
      <div className="relative min-h-0 min-w-0 overflow-hidden z-10">
        <DungeonMap grid={mapGrid} />
      </div>
      <div className="relative min-h-0 min-w-0 overflow-hidden z-10">
        <ActionMenu mode={actionMode} onAction={handleAction} canInteract={canInteract} />
      </div>
      <div className="relative min-h-0 min-w-0 overflow-hidden z-10">
        <FuturePanel
          inventory={player.inventory}
          showInventory={showInventory}
          selectedInventoryId={selectedInventoryId}
          onSelectItem={setSelectedInventoryId}
          onUseItem={handleInventoryUse}
        />
      </div>
    </div>
  );
}

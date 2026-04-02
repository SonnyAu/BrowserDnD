"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import CharacterPanel from "./CharacterPanel";
import EventLog from "./EventLog";
import DungeonMap from "./DungeonMap";
import ActionMenu from "./ActionMenu";
import FuturePanel from "./FuturePanel";
import { createDungeon, getVisibleMap, handleMovementInput } from "@/engine/dungeonEngine";
import { PlayerState, ItemData } from "@/engine/types";
import { ActionMode, initialPlayerState } from "./data/mockData";

// Item lookup by tile char
const TILE_ITEMS: Record<string, Omit<ItemData, "id">> = {
  T: { name: "Ancient Relic", type: "treasure", value: 50 },
  W: { name: "Iron Sword", type: "weapon", attack: 8 },
  A: { name: "Leather Armor", type: "armor", defense: 4 },
  K: { name: "Old Key", type: "key" },
};

export default function GameLayout() {
  const [dungeon, setDungeon] = useState(() => createDungeon());
  const [player, setPlayer] = useState<PlayerState>(initialPlayerState);
  const [messages, setMessages] = useState<{ id: number; text: string }[]>([
    { id: 0, text: "You cross the Narrow Sea. Use WASD or arrow keys to march." },
  ]);
  const [actionMode, setActionMode] = useState<ActionMode>("default");
  const [pendingItem, setPendingItem] = useState<ItemData | null>(null);
  const msgIdRef = useRef(1);

  const addMessage = (text: string) =>
    setMessages((prev) => [...prev, { id: msgIdRef.current++, text }]);

  const handleAction = useCallback(
    (action: string) => {
      switch (action) {
        case "Pick Up":
          if (pendingItem) {
            setPlayer((p) => ({ ...p, inventory: [...p.inventory, pendingItem] }));
            addMessage(`${pendingItem.name} added to inventory.`);
            setPendingItem(null);
            setActionMode("default");
          }
          break;
        case "Leave":
          setPendingItem(null);
          setActionMode("default");
          addMessage("You leave it behind.");
          break;
        case "Run":
          setActionMode("default");
          addMessage("You retreat from battle.");
          break;
        // Combat, dialogue, and other actions — Phase 4/5
        default:
          addMessage(`[${action}] — not yet implemented.`);
      }
    },
    [pendingItem]
  );

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      // Lock movement during combat, loot prompt, or dialogue
      if (actionMode !== "default") return;

      const result = handleMovementInput(e.key, dungeon);
      if (!result) return;

      setDungeon(result.dungeon);

      if (result.event === "enemyEncounter") {
        addMessage("Steel is drawn — a foe approaches.");
        setActionMode("combat");
      } else if (result.event === "itemPickup") {
        const tileChar = result.itemTile as string;
        const base = TILE_ITEMS[tileChar];
        if (base) {
          const item: ItemData = { ...base, id: `${tileChar}-${msgIdRef.current}` };
          setPendingItem(item);
          addMessage(`You find a ${item.name}.`);
          setActionMode("loot");
        }
      } else if (result.event === "npcInteract") {
        addMessage("A figure regards you silently...");
        setActionMode("dialogue");
      }
    },
    [dungeon, actionMode]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const visibleMap = getVisibleMap(dungeon);

  return (
    <div className="grid h-screen w-screen grid-cols-[300px_1fr_350px] grid-rows-[2fr_1fr] gap-2 overflow-hidden bg-[#090909] p-2 text-[#e8d9b5]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(127,29,29,0.2),transparent_35%),radial-gradient(circle_at_90%_5%,rgba(146,120,62,0.12),transparent_30%)]" />

      <div className="relative row-span-2">
        <CharacterPanel player={player} />
      </div>

      <div className="relative">
        <EventLog messages={messages} />
      </div>

      <div className="relative">
        <DungeonMap grid={visibleMap} />
      </div>

      <div className="relative">
        <ActionMenu mode={actionMode} onAction={handleAction} />
      </div>

      <div className="relative">
        <FuturePanel />
      </div>
    </div>
  );
}

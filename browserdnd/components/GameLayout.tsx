"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import CharacterPanel from "./CharacterPanel";
import EventLog from "./EventLog";
import DungeonMap from "./DungeonMap";
import ActionMenu from "./ActionMenu";
import FuturePanel from "./FuturePanel";
import { createDungeon, getVisibleMap, handleMovementInput } from "@/engine/dungeonEngine";
import { ActionMode } from "./data/mockData";

function deriveActionMode(message: string): ActionMode {
  const lowered = message.toLowerCase();

  if (lowered.includes("foe") || lowered.includes("enemy") || lowered.includes("steel")) {
    return "combat";
  }

  if (
    lowered.includes("says") ||
    lowered.includes("asks") ||
    lowered.includes("speaks") ||
    lowered.includes('"')
  ) {
    return "dialogue";
  }

  return "default";
}

export default function GameLayout() {
  const [dungeon, setDungeon] = useState(() => createDungeon());
  const [messages, setMessages] = useState<{ id: number; text: string }[]>([
    { id: 0, text: "You cross the Narrow Sea. Use WASD or arrow keys to march." },
  ]);
  const [actionMode, setActionMode] = useState<ActionMode>("default");
  const msgIdRef = useRef(1);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const result = handleMovementInput(e.key, dungeon);
      if (!result) return;

      setDungeon(result.dungeon);

      if (result.event === "enemyEncounter") {
        const id = msgIdRef.current++;
        const text = "Steel is drawn — a foe approaches.";
        setMessages((prev) => [...prev, { id, text }]);
        setActionMode(deriveActionMode(text));
      } else if (result.event === "itemPickup") {
        const id = msgIdRef.current++;
        const text = "A relic of the old kingdoms is claimed.";
        setMessages((prev) => [...prev, { id, text }]);
        setActionMode(deriveActionMode(text));
      } else {
        setActionMode("default");
      }
    },
    [dungeon]
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
        <CharacterPanel />
      </div>

      <div className="relative">
        <EventLog messages={messages} />
      </div>

      <div className="relative">
        <DungeonMap grid={visibleMap} />
      </div>

      <div className="relative">
        <ActionMenu mode={actionMode} />
      </div>

      <div className="relative">
        <FuturePanel />
      </div>
    </div>
  );
}

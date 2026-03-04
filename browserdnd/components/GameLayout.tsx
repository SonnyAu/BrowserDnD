"use client";

import { useState, useEffect, useCallback } from "react";
import CharacterPanel from "./CharacterPanel";
import EventLog from "./EventLog";
import DungeonMap from "./DungeonMap";
import ActionMenu from "./ActionMenu";
import FuturePanel from "./FuturePanel";
import { createDungeon, getVisibleMap, handleMovementInput } from "@/engine/dungeonEngine";

export default function GameLayout() {
  const [dungeon, setDungeon] = useState(() => createDungeon());
  const [messages, setMessages] = useState<{ id: number; text: string }[]>([
    { id: 0, text: "You enter the dungeon. Use WASD or arrow keys to move." },
  ]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const result = handleMovementInput(e.key, dungeon);
      if (!result) return;

      setDungeon(result.dungeon);

      if (result.event === "enemyEncounter") {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), text: "An enemy appears!" },
        ]);
      } else if (result.event === "itemPickup") {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), text: "You found an item!" },
        ]);
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
    <div className="grid h-screen w-screen grid-cols-[300px_1fr_350px] grid-rows-[2fr_1fr] bg-[#0f0f0f] text-[#e5e5e5] gap-2 p-2 overflow-hidden">
      {/* Left column — spans both rows */}
      <div className="row-span-2">
        <CharacterPanel />
      </div>

      {/* Top middle */}
      <EventLog messages={messages} />

      {/* Top right */}
      <DungeonMap grid={visibleMap} />

      {/* Bottom middle */}
      <ActionMenu />

      {/* Bottom right */}
      <FuturePanel />
    </div>
  );
}

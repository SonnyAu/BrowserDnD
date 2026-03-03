"use client";

import { useEffect } from "react";
import { dungeonGrid, TileType } from "./data/mockData";

const tileColors: Record<TileType, string> = {
  player: "bg-[#7c3aed]",
  enemy: "bg-red-700",
  treasure: "bg-yellow-500",
  wall: "bg-zinc-700",
  empty: "bg-zinc-900",
  unexplored: "bg-zinc-950",
};

export default function DungeonMap() {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      const dirMap: Record<string, string> = {
        w: "up",
        a: "left",
        s: "down",
        d: "right",
        arrowup: "up",
        arrowleft: "left",
        arrowdown: "down",
        arrowright: "right",
      };
      const direction = dirMap[key];
      if (direction) {
        console.log(`Move: ${direction}`);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] shadow-lg">
      <div className="border-b border-[#2a2a2a] px-4 py-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#7c3aed]">
          Dungeon Map
        </h2>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="grid grid-cols-10 gap-[2px]">
          {dungeonGrid.map((row, y) =>
            row.map((tile, x) => (
              <div
                key={`${x}-${y}`}
                className={`h-6 w-6 rounded-sm ${tileColors[tile]} ${
                  tile === "player"
                    ? "ring-2 ring-[#7c3aed] ring-offset-1 ring-offset-[#0f0f0f]"
                    : ""
                }`}
                title={tile}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

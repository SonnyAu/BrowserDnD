"use client";

import { characterData } from "./data/mockData";
import EquipmentGrid from "./EquipmentGrid";

function StatBar({
  label,
  current,
  max,
  color,
}: {
  label: string;
  current: number;
  max: number;
  color: string;
}) {
  const pct = Math.round((current / max) * 100);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span>
          {current}/{max}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#2a2a2a]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function CharacterPanel() {
  const c = characterData;

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4 shadow-lg">
      {/* Character Info */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-[#7c3aed]">{c.name}</h2>
        <span className="text-sm text-[#e5e5e5]/70">Level {c.level}</span>

        <StatBar label="HP" current={c.hp.current} max={c.hp.max} color="bg-red-500" />
        <StatBar label="MP" current={c.mp.current} max={c.mp.max} color="bg-blue-500" />
        <StatBar label="XP" current={c.xp.current} max={c.xp.max} color="bg-yellow-500" />

        <div className="flex items-center gap-2 text-sm">
          <span className="text-yellow-400">💰</span>
          <span>{c.gold} Gold</span>
        </div>
      </div>

      <hr className="border-[#2a2a2a]" />

      {/* Equipment */}
      <EquipmentGrid />
    </div>
  );
}

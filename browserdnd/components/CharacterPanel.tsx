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
      <div className="flex justify-between text-xs tracking-wide text-[#e8d9b5]/85">
        <span>{label}</span>
        <span>
          {current}/{max}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#3a2d22] bg-[#1a1411]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function CharacterPanel() {
  const c = characterData;

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto rounded-lg border border-[#3d2f23] bg-[linear-gradient(160deg,#15100d_0%,#1d1612_55%,#17120f_100%)] p-4 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a8874b]/60 to-transparent" />

      {/* Character Info */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold uppercase tracking-[0.15em] text-[#d9b66f]">{c.name}</h2>
        <span className="text-xs uppercase tracking-[0.2em] text-[#bca57a]">Sworn Sword • Level {c.level}</span>

        <StatBar label="Vigor" current={c.hp.current} max={c.hp.max} color="bg-red-800" />
        <StatBar label="Focus" current={c.mp.current} max={c.mp.max} color="bg-sky-900" />
        <StatBar label="Renown" current={c.xp.current} max={c.xp.max} color="bg-amber-700" />

        <div className="flex items-center gap-2 text-sm text-[#e8d9b5]">
          <span className="text-[#d9b66f]">🪙</span>
          <span>{c.gold} Dragons</span>
        </div>
      </div>

      <hr className="border-[#3d2f23]" />

      {/* Equipment */}
      <EquipmentGrid />
    </div>
  );
}

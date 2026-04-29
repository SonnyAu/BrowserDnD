"use client";

import { PlayerState } from "@/engine/types";
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

interface CharacterPanelProps {
  player: PlayerState;
  onEquipmentSlotClick?: (slot: string) => void;
}

export default function CharacterPanel({ player, onEquipmentSlotClick }: CharacterPanelProps) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto rounded-lg border border-[#3d2f23] bg-[linear-gradient(160deg,#15100d_0%,#1d1612_55%,#17120f_100%)] p-4 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a8874b]/60 to-transparent" />
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold uppercase tracking-[0.15em] text-[#d9b66f]">{player.name}</h2>
        <span className="text-xs uppercase tracking-[0.2em] text-[#bca57a]">Sworn Sword • Level {player.level}</span>
        <StatBar label="Vigor" current={player.hp} max={player.maxHp} color="bg-red-800" />
        <StatBar label="Focus" current={player.mp} max={player.maxMp} color="bg-sky-900" />
        <StatBar label="Renown" current={player.xp} max={player.maxXp} color="bg-amber-700" />
        <div className="flex items-center gap-2 text-sm text-[#e8d9b5]">
          <span className="text-[#d9b66f]">🪙</span>
          <span>{player.gold} Dragons</span>
        </div>
        <div className="flex gap-4 text-xs text-[#e8d9b5]/70">
          <span>ATK <span className="text-[#d9b66f]">{player.attack}</span></span>
          <span>DEF <span className="text-[#d9b66f]">{player.defense}</span></span>
        </div>
      </div>
      <hr className="border-[#3d2f23]" />
      <EquipmentGrid equipment={player.equipment} onSlotClick={onEquipmentSlotClick} />
    </div>
  );
}

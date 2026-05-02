"use client";

import { PlayerState } from "@/engine/types";
import EquipmentGrid from "./EquipmentGrid";

function C({ x, y }: { x: "l" | "r"; y: "t" | "b" }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden
      className="absolute w-8 h-8 pointer-events-none z-10"
      style={{
        top:    y === "t" ? 0 : "auto",
        bottom: y === "b" ? 0 : "auto",
        left:   x === "l" ? 0 : "auto",
        right:  x === "r" ? 0 : "auto",
        transform: `scale(${x === "r" ? -1 : 1}, ${y === "b" ? -1 : 1})`,
      }}
    >
      <path d="M1 35 L1 6 Q1 1 6 1 L35 1" stroke="#6a4a20" strokeWidth="1.5" />
      <path d="M4 32 L4 8 Q4 4 8 4 L32 4" stroke="#c9a14a" strokeWidth="0.6" opacity="0.55" />
      <circle cx="5.5" cy="5.5" r="2" fill="#c9a14a" opacity="0.7" />
      <circle cx="5.5" cy="5.5" r="0.9" fill="#f1d27a" opacity="0.6" />
      <path d="M5.5 14 C5.5 9.5 9.5 5.5 14 5.5" stroke="#c9a14a" strokeWidth="0.7" opacity="0.4" />
    </svg>
  );
}

function Divider() {
  return (
    <div className="flex items-center my-1" aria-hidden>
      <div className="h-px flex-1 bg-linear-to-r from-transparent to-[#4a3018]" />
      <svg className="mx-2 w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none">
        <path d="M8 1 L15 8 L8 15 L1 8 Z" stroke="#c9a14a" strokeWidth="0.8" fill="rgba(201,161,74,0.12)" />
        <circle cx="8" cy="8" r="1.2" fill="#c9a14a" />
      </svg>
      <div className="h-px flex-1 bg-linear-to-l from-transparent to-[#4a3018]" />
    </div>
  );
}

function StatBar({
  label,
  current,
  max,
  fillClass,
}: {
  label: string;
  current: number;
  max: number;
  fillClass: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round((current / max) * 100)));
  const isDanger = label === "Vigor" && pct < 25;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <span
          className="text-[10px] tracking-[0.18em] uppercase text-[#c9a14a]/80"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          {label}
        </span>
        <span className="text-[10px] text-[#e8d9b5]/60 tabular-nums">
          {current}/{max}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full border border-[#3a2010] bg-[#0c0806] shadow-[inset_0_2px_5px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div
          className={`relative h-full rounded-full transition-all duration-500 ${fillClass} ${isDanger ? "hp-danger" : ""}`}
          style={{ width: `${pct}%` }}
        >
          <div className="absolute inset-x-1 top-0 h-px rounded-full bg-white/20" />
        </div>
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
    <div className="panel-parchment relative h-full overflow-hidden rounded-sm">
      <C x="l" y="t" /><C x="r" y="t" /><C x="l" y="b" /><C x="r" y="b" />

      {/* Top hairline accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#c9a14a]/35 to-transparent pointer-events-none" aria-hidden />

      {/* Scrollable content */}
      <div className="h-full overflow-y-auto px-5 py-5 flex flex-col gap-3">
        {/* Identity */}
        <div className="flex flex-col gap-2 pt-1">
          <h2
            className="text-xl font-bold tracking-[0.1em] text-[#f1d27a]"
            style={{ fontFamily: '"Cinzel", serif', textShadow: "0 0 24px rgba(201,161,74,0.25)" }}
          >
            {player.name}
          </h2>
          <span
            className="text-[10px] tracking-[0.24em] uppercase text-[#c9a14a]/70"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            Sworn Sword • Level {player.level}
          </span>
        </div>

        {/* Stat bars */}
        <div className="flex flex-col gap-3">
          <StatBar
            label="Vigor"
            current={player.hp}
            max={player.maxHp}
            fillClass="bg-linear-to-r from-[#6a1818] to-[#a82828]"
          />
          <StatBar
            label="Focus"
            current={player.mp}
            max={player.maxMp}
            fillClass="bg-linear-to-r from-[#2c4a7a] to-[#3a62a0]"
          />
          <StatBar
            label="Renown"
            current={player.xp}
            max={player.maxXp}
            fillClass="bg-linear-to-r from-[#7a5818] to-[#c9a14a]"
          />
        </div>

        {/* Currency */}
        <div className="flex items-center gap-2 text-sm text-[#e8d9b5]/85">
          <span className="text-base leading-none">🪙</span>
          <span>{player.gold} Dragons</span>
        </div>

        {/* Combat stats */}
        <div className="flex gap-5 text-xs text-[#e8d9b5]/60">
          <span>
            ATK{" "}
            <span
              className="font-semibold text-[#f1d27a]"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              {player.attack}
            </span>
          </span>
          <span>
            DEF{" "}
            <span
              className="font-semibold text-[#f1d27a]"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              {player.defense}
            </span>
          </span>
        </div>

        <Divider />

        <EquipmentGrid equipment={player.equipment} onSlotClick={onEquipmentSlotClick} />
      </div>
    </div>
  );
}

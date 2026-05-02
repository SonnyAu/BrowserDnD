"use client";

import { ItemData } from "@/engine/types";

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

function WaxSeal() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden>
      <defs>
        <radialGradient id="seal-shine" cx="38%" cy="30%" r="60%">
          <stop offset="0%" stopColor="rgba(255,210,180,0.14)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="30" cy="30" r="28" fill="#3d0a0a" />
      <circle cx="30" cy="30" r="28" fill="none" stroke="#6a1818" strokeWidth="1.5" />
      <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(201,161,74,0.2)" strokeWidth="0.7" />
      <path
        d="M30 14 L27 22 L18.5 20 L24 28 L18.5 36 L27 34 L30 42 L33 34 L41.5 36 L36 28 L41.5 20 L33 22 Z"
        stroke="rgba(201,161,74,0.4)"
        strokeWidth="0.8"
        fill="rgba(201,161,74,0.06)"
      />
      <circle cx="30" cy="30" r="3.5" fill="none" stroke="rgba(201,161,74,0.35)" strokeWidth="0.7" />
      <circle cx="30" cy="30" r="28" fill="url(#seal-shine)" />
    </svg>
  );
}

const typeIcons: Record<string, string> = {
  weapon:     "⚔",
  armor:      "🛡",
  consumable: "⚗",
  treasure:   "◈",
  key:        "⌘",
};

interface FuturePanelProps {
  inventory: ItemData[];
  showInventory: boolean;
  selectedInventoryId: string | null;
  onSelectItem: (id: string) => void;
  onUseItem: (id: string) => void;
}

export default function FuturePanel({
  inventory,
  showInventory,
  selectedInventoryId,
  onSelectItem,
  onUseItem,
}: FuturePanelProps) {
  if (!showInventory) {
    return (
      <div className="panel-parchment relative flex h-full flex-col items-center justify-center rounded-sm gap-3">
        <C x="l" y="t" /><C x="r" y="t" /><C x="l" y="b" /><C x="r" y="b" />
        <WaxSeal />
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase text-[#f1d27a]"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          Small Council Ledger
        </p>
        <p className="text-[10px] tracking-wide uppercase text-foreground/40" style={{ fontFamily: '"Cinzel", serif' }}>
          Tap Inventory to manage gear.
        </p>
      </div>
    );
  }

  return (
    <div className="panel-parchment relative flex h-full flex-col rounded-sm overflow-hidden">
      <C x="l" y="t" /><C x="r" y="t" /><C x="l" y="b" /><C x="r" y="b" />

      {/* Header */}
      <div className="relative shrink-0 border-b border-[#4a3018] px-5 py-3">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#c9a14a]/30 to-transparent" aria-hidden />
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase text-[#f1d27a]"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          Inventory
        </p>
        <p className="mt-0.5 text-[10px] tracking-wide uppercase text-foreground/45" style={{ fontFamily: '"Cinzel", serif' }}>
          Select item, then click an Armory slot to equip.
        </p>
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5">
        {inventory.length === 0 && (
          <p className="text-xs text-foreground/40 italic" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            No items in your satchel.
          </p>
        )}
        {inventory.map((item) => {
          const selected = selectedInventoryId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              onDoubleClick={() => onUseItem(item.id)}
              className="w-full rounded-sm px-3 py-2 text-left flex items-center gap-2 transition-all"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: "0.8rem",
                border: selected ? "1px solid #c9a14a" : "1px solid #3d2810",
                background: selected
                  ? "linear-gradient(160deg, #2a1a08 0%, #1e1207 100%)"
                  : "linear-gradient(160deg, #180f07 0%, #120c05 100%)",
                color: selected ? "#f1d27a" : "#d4b97a",
                boxShadow: selected
                  ? "inset 0 1px 0 rgba(201,161,74,0.15), 0 0 8px rgba(201,161,74,0.12)"
                  : "inset 0 1px 0 rgba(201,161,74,0.05)",
              }}
            >
              <span className="text-[#c9a14a]/70 text-sm leading-none shrink-0">
                {typeIcons[item.type] ?? "·"}
              </span>
              <span className="flex-1 truncate">{item.name}</span>
              <span
                className="shrink-0 text-[10px] tracking-wider uppercase"
                style={{ color: selected ? "#c9a14a" : "#8a6a2a" }}
              >
                {item.type}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

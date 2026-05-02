"use client";

import { actionButtons, ActionMode } from "./data/mockData";

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

interface ActionMenuProps {
  mode: ActionMode;
  onAction: (action: string) => void;
  canInteract?: boolean;
}

export default function ActionMenu({ mode, onAction, canInteract = false }: ActionMenuProps) {
  const modeLabels: Record<ActionMode, string> = {
    default:  "Council Commands",
    dialogue: "Court Audience",
    combat:   "Battle Orders",
    loot:     "Spoils of War",
  };

  const modeHints: Record<ActionMode, string> = {
    default:  "Available while traversing and scouting.",
    dialogue: "Your responses change with who you address.",
    combat:   "Orders shift as steel is drawn.",
    loot:     "A relic lies before you.",
  };

  const modeAccent: Record<ActionMode, string> = {
    default:  "#c9a14a",
    dialogue: "#7fa6d6",
    combat:   "#c8423d",
    loot:     "#c9a14a",
  };

  const actions =
    mode === "default"
      ? actionButtons.default.filter((a) => canInteract || a !== "Interact")
      : actionButtons[mode];

  const accent = modeAccent[mode];

  return (
    <div className="panel-parchment relative flex h-full flex-col overflow-hidden rounded-sm">
      <C x="l" y="t" /><C x="r" y="t" /><C x="l" y="b" /><C x="r" y="b" />

      {/* Banner header */}
      <div
        className="relative shrink-0 border-b border-[#4a3018] px-5 py-3"
        style={{ transition: "border-color 200ms ease-in-out" }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}40, transparent)` }}
          aria-hidden
        />
        {/* Mode indicator dot */}
        <div
          className="absolute left-5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
          style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
          aria-hidden
        />
        <div className="pl-4">
          <h2
            key={mode}
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{
              fontFamily: '"Cinzel", serif',
              color: accent,
              transition: "color 200ms ease-in-out",
            }}
          >
            {modeLabels[mode]}
          </h2>
          <p
            className="mt-0.5 text-[10px] tracking-wide uppercase text-foreground/45"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            {modeHints[mode]}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-1 flex-wrap items-center justify-center gap-3 p-4">
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => onAction(action)}
            className="iron-btn px-6 py-3 rounded-sm"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { actionButtons, ActionMode } from "./data/mockData";

interface ActionMenuProps {
  mode: ActionMode;
  onAction: (action: string) => void;
  canInteract?: boolean;
}

export default function ActionMenu({ mode, onAction, canInteract = false }: ActionMenuProps) {
  const modeLabels: Record<ActionMode, string> = {
    default: "Council Commands",
    dialogue: "Court Audience",
    combat: "Battle Orders",
    loot: "Spoils of War",
  };

  const modeHints: Record<ActionMode, string> = {
    default: "Available while traversing and scouting.",
    dialogue: "Your responses change with who you address.",
    combat: "Orders shift as steel is drawn.",
    loot: "A relic lies before you.",
  };

  const actions = mode === "default" ? actionButtons.default.filter((action) => canInteract || action !== "Interact") : actionButtons[mode];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-[#3d2f23] bg-[linear-gradient(165deg,#17120f,#120e0c)] shadow-[0_0_20px_rgba(0,0,0,0.45)]">
      <div className="border-b border-[#3d2f23] px-4 py-2">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d9b66f]">
          {modeLabels[mode]}
        </h2>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-[#e8d9b5]/55">{modeHints[mode]}</p>
      </div>

      <div className="flex flex-1 flex-wrap items-center justify-center gap-3 p-4">
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => onAction(action)}
            className="rounded-lg border border-[#3d2f23] bg-[#140f0d] px-6 py-3 text-sm font-medium uppercase tracking-wide text-[#e8d9b5] transition-all hover:border-[#a37f42] hover:bg-[#241913] hover:shadow-[0_0_10px_rgba(163,127,66,0.35)]"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}

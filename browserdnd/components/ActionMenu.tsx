"use client";

import { useState } from "react";
import { actionButtons, ActionMode } from "./data/mockData";

export default function ActionMenu() {
  const [mode, setMode] = useState<ActionMode>("default");

  const modeLabels: Record<ActionMode, string> = {
    default: "Actions",
    dialogue: "Dialogue",
    combat: "Combat",
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] shadow-lg">
      <div className="flex items-center justify-between border-b border-[#2a2a2a] px-4 py-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#7c3aed]">
          {modeLabels[mode]}
        </h2>
        <div className="flex gap-1">
          {(Object.keys(actionButtons) as ActionMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded px-2 py-0.5 text-xs transition-colors ${
                mode === m
                  ? "bg-[#7c3aed] text-white"
                  : "text-[#e5e5e5]/60 hover:text-[#e5e5e5]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-wrap items-center justify-center gap-3 p-4">
        {actionButtons[mode].map((action) => (
          <button
            key={action}
            onClick={() => console.log(`Action: ${action}`)}
            className="rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-6 py-3 text-sm font-medium text-[#e5e5e5] transition-all hover:border-[#7c3aed] hover:shadow-[0_0_8px_rgba(124,58,237,0.4)]"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}

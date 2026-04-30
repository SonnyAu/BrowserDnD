"use client";

const tileStyles: Record<string, string> = {
  "?": "bg-[#0f0c0a]",
  "#": "bg-[#3b3028]",
  ".": "bg-[#1d1714]",
  P: "bg-[#b08d57]",
  E: "bg-[#7f1d1d]",
  T: "bg-[#c2973f]",
  W: "bg-[#1f4a6b]",
  N: "bg-[#7f4b22]",
  B: "bg-[#4f1111]",
  A: "bg-[#365436]",
  K: "bg-[#9d7a35]",
  D: "bg-[#6a5534]",
  S: "bg-[#6a635b]",
  F: "bg-[#4b3a27]",
};

interface DungeonMapProps {
  grid: string[][];
}

export default function DungeonMap({ grid }: DungeonMapProps) {
  const width = grid[0]?.length ?? 0;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-[#3d2f23] bg-[linear-gradient(170deg,#17120f,#120e0c)] shadow-[0_0_20px_rgba(0,0,0,0.45)]">
      <div className="border-b border-[#3d2f23] px-4 py-2">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d9b66f]">
          War Map
        </h2>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div
          className="grid gap-[2px] rounded-md border border-[#3a2d22] bg-[#100c0a] p-2"
          style={{ gridTemplateColumns: `repeat(${width}, 1.5rem)` }}
        >
          {grid.map((row, y) =>
            row.map((tile, x) => (
              <div
                key={`${x}-${y}`}
                className={`h-6 w-6 rounded-sm ${tileStyles[tile] ?? "bg-[#0f0c0a]"} ${
                  tile === "P"
                    ? "ring-2 ring-[#d9b66f] ring-offset-1 ring-offset-[#0f0c0a]"
                    : ""
                }`}
                title={tile === "F" ? "Found NPC" : tile}
              >
                {tile === "F" ? <span className="text-[10px] text-[#f2d58b]">👤</span> : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

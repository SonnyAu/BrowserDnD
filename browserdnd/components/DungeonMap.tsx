"use client";

const tileStyles: Record<string, string> = {
  "?": "bg-zinc-950",
  "#": "bg-zinc-700",
  ".": "bg-zinc-900",
  P: "bg-[#7c3aed]",
  E: "bg-red-700",
  T: "bg-yellow-500",
  W: "bg-blue-500",
  N: "bg-orange-500",
  B: "bg-red-900",
  A: "bg-green-600",
  K: "bg-amber-400",
  D: "bg-amber-800",
  S: "bg-stone-500",
};

interface DungeonMapProps {
  grid: string[][];
}

export default function DungeonMap({ grid }: DungeonMapProps) {
  const width = grid.length > 0 ? grid[0].length : 0;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] shadow-lg">
      <div className="border-b border-[#2a2a2a] px-4 py-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#7c3aed]">
          Dungeon Map
        </h2>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div
          className="grid gap-[2px]"
          style={{ gridTemplateColumns: `repeat(${width}, 1.5rem)` }}
        >
          {grid.map((row, y) =>
            row.map((tile, x) => (
              <div
                key={`${x}-${y}`}
                className={`h-6 w-6 rounded-sm ${tileStyles[tile] ?? "bg-zinc-950"} ${
                  tile === "P"
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

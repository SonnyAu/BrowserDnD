"use client";

const tileData: Record<string, { bg: string; shadow?: string }> = {
  "?": { bg: "#0d0b09",   shadow: "inset 0 0 6px rgba(0,0,0,0.9)" },
  "#": { bg: "#2e2620",   shadow: "inset 1px 1px 0 rgba(80,60,40,0.4), inset -1px -1px 0 rgba(0,0,0,0.7)" },
  ".": { bg: "#1a1410",   shadow: "inset 1px 1px 0 rgba(60,45,30,0.3), inset -1px -1px 0 rgba(0,0,0,0.5)" },
  P:   { bg: "#b08d57",   shadow: "" },
  E:   { bg: "#7f1d1d",   shadow: "inset 1px 1px 0 rgba(200,66,61,0.25), inset -1px -1px 0 rgba(0,0,0,0.6)" },
  T:   { bg: "#b8902e",   shadow: "inset 1px 1px 0 rgba(241,210,122,0.3), inset -1px -1px 0 rgba(0,0,0,0.5)" },
  W:   { bg: "#1f4a6b",   shadow: "inset 1px 1px 0 rgba(127,166,214,0.2), inset -1px -1px 0 rgba(0,0,0,0.5)" },
  N:   { bg: "#7f4b22",   shadow: "inset 1px 1px 0 rgba(180,120,60,0.2), inset -1px -1px 0 rgba(0,0,0,0.5)" },
  B:   { bg: "#4f1111",   shadow: "inset 1px 1px 0 rgba(180,40,40,0.2), inset -1px -1px 0 rgba(0,0,0,0.6)" },
  A:   { bg: "#365436",   shadow: "inset 1px 1px 0 rgba(100,160,80,0.2), inset -1px -1px 0 rgba(0,0,0,0.5)" },
  K:   { bg: "#9d7a35",   shadow: "inset 1px 1px 0 rgba(201,161,74,0.25), inset -1px -1px 0 rgba(0,0,0,0.5)" },
  D:   { bg: "#6a5534",   shadow: "inset 1px 1px 0 rgba(160,130,80,0.2), inset -1px -1px 0 rgba(0,0,0,0.5)" },
  S:   { bg: "#5a5248",   shadow: "inset 1px 1px 0 rgba(160,150,140,0.2), inset -1px -1px 0 rgba(0,0,0,0.5)" },
  F:   { bg: "#4b3a27",   shadow: "inset 1px 1px 0 rgba(120,90,50,0.2), inset -1px -1px 0 rgba(0,0,0,0.5)" },
};

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

interface DungeonMapProps {
  grid: string[][];
}

export default function DungeonMap({ grid }: DungeonMapProps) {
  const width = grid[0]?.length ?? 0;

  return (
    <div className="panel-parchment relative flex h-full flex-col overflow-hidden rounded-sm">
      <C x="l" y="t" /><C x="r" y="t" /><C x="l" y="b" /><C x="r" y="b" />

      {/* Header cartouche */}
      <div className="relative shrink-0 border-b border-[#4a3018] px-4 py-2.5 text-center">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#c9a14a]/30 to-transparent" aria-hidden />
        <div className="absolute inset-y-0 left-4 right-4 flex items-center pointer-events-none" aria-hidden>
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-[#4a3018]/60" />
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-[#4a3018]/60" />
        </div>
        <h2
          className="relative inline-block px-3 text-xs font-semibold tracking-[0.22em] uppercase text-[#f1d27a]"
          style={{
            fontFamily: '"Cinzel", serif',
            background: "linear-gradient(165deg, #1f1509 0%, #241a0c 100%)",
          }}
        >
          War Map
        </h2>
      </div>

      {/* Map area */}
      <div className="relative flex flex-1 items-center justify-center p-3 overflow-hidden">
        {/* Leather inner frame */}
        <div
          className="relative p-2 rounded-sm"
          style={{
            background: "#100c08",
            border: "1px solid #3a2810",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,0,0,0.5)",
          }}
        >
          {/* Iron corner brackets */}
          {(["tl","tr","bl","br"] as const).map((pos) => (
            <svg
              key={pos}
              width="10" height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden
              className="absolute w-2.5 h-2.5 pointer-events-none"
              style={{
                top:    pos.startsWith("t") ? -1 : "auto",
                bottom: pos.startsWith("b") ? -1 : "auto",
                left:   pos.endsWith("l")   ? -1 : "auto",
                right:  pos.endsWith("r")   ? -1 : "auto",
                transform: `scale(${pos.endsWith("r") ? -1 : 1}, ${pos.startsWith("b") ? -1 : 1})`,
              }}
            >
              <path d="M1 9 L1 2 L9 2" stroke="#8a6a2a" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          ))}

          {/* Tile grid */}
          <div
            className="grid gap-0.5"
            style={{ gridTemplateColumns: `repeat(${width}, 1.5rem)` }}
          >
            {grid.map((row, y) =>
              row.map((tile, x) => {
                const data = tileData[tile] ?? tileData["?"];
                const isPlayer = tile === "P";
                return (
                  <div
                    key={`${x}-${y}`}
                    className={`h-6 w-6 rounded-xs ${isPlayer ? "tile-player-pulse" : ""}`}
                    style={{
                      background: data.bg,
                      boxShadow: isPlayer ? undefined : data.shadow,
                    }}
                    title={tile === "F" ? "Found NPC" : tile}
                  >
                    {tile === "F" ? (
                      <span className="flex h-full w-full items-center justify-center text-[9px]">👤</span>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Cardinal compass — bottom-right */}
        <div className="absolute bottom-4 right-4 pointer-events-none opacity-20" aria-hidden>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <circle cx="17" cy="17" r="15" stroke="#c9a14a" strokeWidth="0.6" />
            <path d="M17 4 L15 12 L17 10 L19 12 Z" fill="#c9a14a" />
            <path d="M17 30 L15 22 L17 24 L19 22 Z" fill="#c9a14a" opacity="0.5" />
            <path d="M30 17 L22 15 L24 17 L22 19 Z" fill="#c9a14a" opacity="0.5" />
            <path d="M4 17 L12 15 L10 17 L12 19 Z" fill="#c9a14a" opacity="0.5" />
            <circle cx="17" cy="17" r="1.5" fill="#c9a14a" />
            <line x1="17" y1="5" x2="17" y2="29" stroke="#c9a14a" strokeWidth="0.35" opacity="0.3" />
            <line x1="5"  y1="17" x2="29" y2="17" stroke="#c9a14a" strokeWidth="0.35" opacity="0.3" />
            <text x="17" y="2.5"  textAnchor="middle" fontSize="3.5" fill="#c9a14a" fontFamily="Cinzel, serif">N</text>
            <text x="17" y="33"   textAnchor="middle" fontSize="3.5" fill="#c9a14a" fontFamily="Cinzel, serif">S</text>
            <text x="32.5" y="18" textAnchor="middle" fontSize="3.5" fill="#c9a14a" fontFamily="Cinzel, serif">E</text>
            <text x="1.5"  y="18" textAnchor="middle" fontSize="3.5" fill="#c9a14a" fontFamily="Cinzel, serif">W</text>
          </svg>
        </div>
      </div>
    </div>
  );
}

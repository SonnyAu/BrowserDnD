"use client";

import { equipmentSlots, EquipmentSlot } from "./data/mockData";
import { Equipment, ItemData } from "@/engine/types";

const slotSilhouettes: Record<string, React.ReactNode> = {
  top: (
    <path d="M6 20 Q6 9 16 6 Q26 9 26 20 L26 22 L6 22 Z" />
  ),
  left: (
    <path d="M8 7 L16 5 L24 7 L24 19 Q24 25 16 27 Q8 25 8 19 Z" />
  ),
  center: (
    <>
      <path d="M8 7 L16 5 L24 7 L22 25 L16 27 L10 25 Z" />
      <path d="M12 13 L20 13" strokeWidth="1.5" stroke="currentColor" fill="none" />
    </>
  ),
  right: (
    <>
      <path d="M15 5 L17 5 L17 23 L15 23 Z" />
      <path d="M12 21 L20 21 L20 23 L12 23 Z" />
      <path d="M14 23 L18 23 L16 27 Z" />
    </>
  ),
  bottom: (
    <path d="M8 5 L24 5 L22 27 L18 27 L16 17 L14 27 L10 27 Z" />
  ),
};

function Rivet({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const style: React.CSSProperties = {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: "radial-gradient(circle at 35% 35%, #c9a14a, #5a3a10)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.5)",
  };
  if (pos === "tl") { style.top = 3;    style.left   = 3;   }
  if (pos === "tr") { style.top = 3;    style.right  = 3;   }
  if (pos === "bl") { style.bottom = 3; style.left   = 3;   }
  if (pos === "br") { style.bottom = 3; style.right  = 3;   }
  return <div style={style} aria-hidden />;
}

function SlotBox({
  slot,
  item,
  onClick,
}: {
  slot: EquipmentSlot;
  item: ItemData | null;
  onClick?: (name: EquipmentSlot["name"]) => void;
}) {
  return (
    <button
      onClick={() => onClick?.(slot.name)}
      title={item ? `${slot.name}: ${item.name}` : slot.name}
      className="relative flex h-16 w-16 flex-col items-center justify-center transition-all"
      style={{
        background: item
          ? "linear-gradient(160deg, #241808 0%, #180f06 100%)"
          : "linear-gradient(160deg, #160e06 0%, #100a04 100%)",
        border: item ? "1px solid #6a4a18" : "1px solid #3a2410",
        borderRadius: 3,
        boxShadow: item
          ? "inset 0 1px 0 rgba(201,161,74,0.15), 0 0 8px rgba(201,161,74,0.1)"
          : "inset 0 1px 0 rgba(201,161,74,0.05), inset 0 -1px 0 rgba(0,0,0,0.4)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "#c9a14a";
        el.style.boxShadow = "inset 0 1px 0 rgba(201,161,74,0.2), 0 0 12px rgba(201,161,74,0.18)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = item ? "#6a4a18" : "#3a2410";
        el.style.boxShadow = item
          ? "inset 0 1px 0 rgba(201,161,74,0.15), 0 0 8px rgba(201,161,74,0.1)"
          : "inset 0 1px 0 rgba(201,161,74,0.05), inset 0 -1px 0 rgba(0,0,0,0.4)";
      }}
    >
      <Rivet pos="tl" />
      <Rivet pos="tr" />
      <Rivet pos="bl" />
      <Rivet pos="br" />

      {item ? (
        <>
          <span className="text-2xl leading-none">{slot.icon}</span>
          <span
            className="mt-0.5 max-w-14 truncate text-[8px] text-[#c9a14a]"
            style={{ fontFamily: '"Cinzel", serif', letterSpacing: "0.05em" }}
          >
            {item.name}
          </span>
        </>
      ) : (
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="currentColor"
          aria-hidden
          className="text-[#6a4a18] opacity-30"
        >
          {slotSilhouettes[slot.position]}
        </svg>
      )}
    </button>
  );
}

interface EquipmentGridProps {
  equipment: Equipment;
  onSlotClick?: (slot: EquipmentSlot["name"]) => void;
}

export default function EquipmentGrid({ equipment, onSlotClick }: EquipmentGridProps) {
  const slotMap = Object.fromEntries(equipmentSlots.map((s) => [s.position, s]));

  const equipmentBySlot: Record<string, ItemData | null> = {
    top:    equipment.helmet,
    left:   equipment.sideWeapon,
    center: equipment.chest,
    right:  equipment.mainWeapon,
    bottom: equipment.pants,
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <h3
        className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#c9a14a]/80"
        style={{ fontFamily: '"Cinzel", serif' }}
      >
        Armory
      </h3>
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        <div />
        <SlotBox slot={slotMap.top}    item={equipmentBySlot.top}    onClick={onSlotClick} />
        <div />
        <SlotBox slot={slotMap.left}   item={equipmentBySlot.left}   onClick={onSlotClick} />
        <SlotBox slot={slotMap.center} item={equipmentBySlot.center} onClick={onSlotClick} />
        <SlotBox slot={slotMap.right}  item={equipmentBySlot.right}  onClick={onSlotClick} />
        <div />
        <SlotBox slot={slotMap.bottom} item={equipmentBySlot.bottom} onClick={onSlotClick} />
        <div />
      </div>
    </div>
  );
}

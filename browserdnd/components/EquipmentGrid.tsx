"use client";

import { equipmentSlots, EquipmentSlot } from "./data/mockData";
import { Equipment, ItemData } from "@/engine/types";

function SlotBox({ slot, item }: { slot: EquipmentSlot; item: ItemData | null }) {
  return (
    <button
      onClick={() => console.log(`Clicked: ${slot.name}`, item)}
      className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border border-[#3d2f23] bg-[#17120f] text-2xl transition-all hover:border-[#a37f42] hover:bg-[#231913] hover:shadow-[0_0_8px_rgba(163,127,66,0.35)]"
      title={item ? `${slot.name}: ${item.name}` : slot.name}
    >
      {slot.icon}
      {item && (
        <span className="mt-0.5 max-w-14 truncate text-[9px] text-[#d9b66f]">{item.name}</span>
      )}
    </button>
  );
}

interface EquipmentGridProps {
  equipment: Equipment;
}

export default function EquipmentGrid({ equipment }: EquipmentGridProps) {
  const slotMap = Object.fromEntries(
    equipmentSlots.map((s) => [s.position, s])
  );

  const equipmentBySlot: Record<string, ItemData | null> = {
    top: equipment.helmet,
    left: equipment.sideWeapon,
    center: equipment.chest,
    right: equipment.mainWeapon,
    bottom: equipment.pants,
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#d9b66f]">
        Armory
      </h3>
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        <div />
        <SlotBox slot={slotMap.top} item={equipmentBySlot.top} />
        <div />
        <SlotBox slot={slotMap.left} item={equipmentBySlot.left} />
        <SlotBox slot={slotMap.center} item={equipmentBySlot.center} />
        <SlotBox slot={slotMap.right} item={equipmentBySlot.right} />
        <div />
        <SlotBox slot={slotMap.bottom} item={equipmentBySlot.bottom} />
        <div />
      </div>
    </div>
  );
}

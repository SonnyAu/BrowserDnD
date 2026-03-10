"use client";

import { equipmentSlots, EquipmentSlot } from "./data/mockData";

function SlotBox({ slot }: { slot: EquipmentSlot }) {
  return (
    <button
      onClick={() => console.log(`Clicked: ${slot.name}`)}
      className="flex h-16 w-16 items-center justify-center rounded-lg border border-[#3d2f23] bg-[#17120f] text-2xl transition-all hover:border-[#a37f42] hover:bg-[#231913] hover:shadow-[0_0_8px_rgba(163,127,66,0.35)]"
      title={slot.name}
    >
      {slot.icon}
    </button>
  );
}

export default function EquipmentGrid() {
  const slotMap = Object.fromEntries(
    equipmentSlots.map((s) => [s.position, s])
  );

  return (
    <div className="flex flex-col items-center gap-1">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#d9b66f]">
        Armory
      </h3>
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        <div />
        <SlotBox slot={slotMap.top} />
        <div />
        <SlotBox slot={slotMap.left} />
        <SlotBox slot={slotMap.center} />
        <SlotBox slot={slotMap.right} />
        <div />
        <SlotBox slot={slotMap.bottom} />
        <div />
      </div>
    </div>
  );
}

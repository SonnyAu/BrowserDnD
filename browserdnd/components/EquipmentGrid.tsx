"use client";

import { equipmentSlots, EquipmentSlot } from "./data/mockData";

function SlotBox({ slot }: { slot: EquipmentSlot }) {
  return (
    <button
      onClick={() => console.log(`Clicked: ${slot.name}`)}
      className="flex h-16 w-16 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] text-2xl transition-all hover:border-[#7c3aed] hover:shadow-[0_0_8px_rgba(124,58,237,0.4)]"
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
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#7c3aed]">
        Equipment
      </h3>
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        {/* Row 1: top center */}
        <div />
        <SlotBox slot={slotMap.top} />
        <div />
        {/* Row 2: left, center, right */}
        <SlotBox slot={slotMap.left} />
        <SlotBox slot={slotMap.center} />
        <SlotBox slot={slotMap.right} />
        {/* Row 3: bottom center */}
        <div />
        <SlotBox slot={slotMap.bottom} />
        <div />
      </div>
    </div>
  );
}

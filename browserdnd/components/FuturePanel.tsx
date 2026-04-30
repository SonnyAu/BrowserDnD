import { ItemData } from "@/engine/types";

interface FuturePanelProps {
  inventory: ItemData[];
  showInventory: boolean;
  selectedInventoryId: string | null;
  onSelectItem: (id: string) => void;
  onUseItem: (id: string) => void;
}

export default function FuturePanel({ inventory, showInventory, selectedInventoryId, onSelectItem, onUseItem }: FuturePanelProps) {
  if (!showInventory) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-lg border border-[#3d2f23] bg-[linear-gradient(165deg,#17120f,#120e0c)] shadow-[0_0_20px_rgba(0,0,0,0.45)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d9b66f]">Small Council Ledger</p>
        <p className="mt-2 text-xs uppercase tracking-wide text-[#e8d9b5]/45">Tap Inventory to manage gear.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-[#3d2f23] bg-[linear-gradient(165deg,#17120f,#120e0c)] p-3 shadow-[0_0_20px_rgba(0,0,0,0.45)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d9b66f]">Inventory</p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-[#e8d9b5]/60">Double-click weapon/armor to equip or consumables to use.</p>
      <div className="mt-3 space-y-2 overflow-y-auto">
        {inventory.length === 0 && <p className="text-xs text-[#e8d9b5]/55">No items.</p>}
        {inventory.map((item) => (
          <button key={item.id} onClick={() => onSelectItem(item.id)} onDoubleClick={() => onUseItem(item.id)} className={`w-full rounded border px-3 py-2 text-left text-xs uppercase tracking-wide ${selectedInventoryId === item.id ? "border-[#d9b66f] bg-[#2b1f17]" : "border-[#3d2f23] bg-[#140f0d]"}`}>
            {item.name} <span className="text-[#e8d9b5]/55">({item.type})</span>
          </button>
        ))}
      </div>
    </div>
  );
}

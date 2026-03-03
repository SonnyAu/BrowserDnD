export default function FuturePanel() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] shadow-lg">
      <p className="text-sm font-semibold uppercase tracking-wider text-[#7c3aed]">
        Future Systems
      </p>
      <ul className="mt-4 space-y-1 text-xs text-[#e5e5e5]/40">
        <li>Quest Tracker</li>
        <li>Buffs / Debuffs</li>
        <li>Notifications</li>
        <li>Minimap</li>
      </ul>
    </div>
  );
}

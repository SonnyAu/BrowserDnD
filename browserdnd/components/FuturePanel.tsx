export default function FuturePanel() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg border border-[#3d2f23] bg-[linear-gradient(165deg,#17120f,#120e0c)] shadow-[0_0_20px_rgba(0,0,0,0.45)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d9b66f]">
        Small Council Ledger
      </p>
      <ul className="mt-4 space-y-1 text-xs uppercase tracking-wide text-[#e8d9b5]/45">
        <li>Quest Chronicle</li>
        <li>Blessings / Curses</li>
        <li>Royal Decrees</li>
        <li>Raven Minimap</li>
      </ul>
    </div>
  );
}

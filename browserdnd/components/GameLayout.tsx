import CharacterPanel from "./CharacterPanel";
import EventLog from "./EventLog";
import DungeonMap from "./DungeonMap";
import ActionMenu from "./ActionMenu";
import FuturePanel from "./FuturePanel";

export default function GameLayout() {
  return (
    <div className="grid h-screen w-screen grid-cols-[300px_1fr_350px] grid-rows-[2fr_1fr] bg-[#0f0f0f] text-[#e5e5e5] gap-2 p-2 overflow-hidden">
      {/* Left column — spans both rows */}
      <div className="row-span-2">
        <CharacterPanel />
      </div>

      {/* Top middle */}
      <EventLog />

      {/* Top right */}
      <DungeonMap />

      {/* Bottom middle */}
      <ActionMenu />

      {/* Bottom right */}
      <FuturePanel />
    </div>
  );
}

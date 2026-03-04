"use client";

import { useRef, useEffect } from "react";
import { eventLogMessages } from "./data/mockData";

export default function EventLog() {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] shadow-lg">
      <div className="border-b border-[#2a2a2a] px-4 py-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#7c3aed]">
          Event Log
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {eventLogMessages.map((msg) => (
            <p key={msg.id} className="text-sm leading-relaxed text-[#e5e5e5]/90">
              {msg.text}
            </p>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}

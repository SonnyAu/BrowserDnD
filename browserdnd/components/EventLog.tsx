"use client";

import { useRef, useEffect } from "react";

interface EventLogProps {
  messages: { id: number; text: string }[];
}

export default function EventLog({ messages }: EventLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-[#3d2f23] bg-[linear-gradient(165deg,#17120f,#120e0c)] shadow-[0_0_20px_rgba(0,0,0,0.45)]">
      <div className="border-b border-[#3d2f23] px-4 py-2">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d9b66f]">
          Raven Dispatches
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <p key={msg.id} className="rounded-md border border-[#3a2d22] bg-[#1b1512]/80 px-3 py-2 text-sm leading-relaxed text-[#e8d9b5]/90">
              {msg.text}
            </p>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}

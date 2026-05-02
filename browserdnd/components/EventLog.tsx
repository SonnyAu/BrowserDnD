"use client";

import { useRef, useEffect } from "react";

function C({ x, y }: { x: "l" | "r"; y: "t" | "b" }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden
      className="absolute w-8 h-8 pointer-events-none z-10"
      style={{
        top:    y === "t" ? 0 : "auto",
        bottom: y === "b" ? 0 : "auto",
        left:   x === "l" ? 0 : "auto",
        right:  x === "r" ? 0 : "auto",
        transform: `scale(${x === "r" ? -1 : 1}, ${y === "b" ? -1 : 1})`,
      }}
    >
      <path d="M1 35 L1 6 Q1 1 6 1 L35 1" stroke="#6a4a20" strokeWidth="1.5" />
      <path d="M4 32 L4 8 Q4 4 8 4 L32 4" stroke="#c9a14a" strokeWidth="0.6" opacity="0.55" />
      <circle cx="5.5" cy="5.5" r="2" fill="#c9a14a" opacity="0.7" />
      <circle cx="5.5" cy="5.5" r="0.9" fill="#f1d27a" opacity="0.6" />
      <path d="M5.5 14 C5.5 9.5 9.5 5.5 14 5.5" stroke="#c9a14a" strokeWidth="0.7" opacity="0.4" />
    </svg>
  );
}

function RavenFeather() {
  return (
    <svg
      width="8"
      height="16"
      viewBox="0 0 8 16"
      fill="none"
      aria-hidden
      className="mt-0.5 shrink-0 opacity-55"
    >
      <path
        d="M4 15 C4 15 0.5 9.5 0.5 5.5 C0.5 2.8 2 1 4 1 C6 1 7.5 2.8 7.5 5.5 C7.5 9.5 4 15 4 15Z"
        fill="rgba(201,161,74,0.22)"
        stroke="#c9a14a"
        strokeWidth="0.7"
      />
      <path d="M4 15 L4 2" stroke="#8a6a2a" strokeWidth="0.55" />
      <path d="M2.2 8 L4 5.5 M5.8 8 L4 5.5" stroke="#c9a14a" strokeWidth="0.45" opacity="0.6" />
      <path d="M1.5 11 L4 8.5 M6.5 11 L4 8.5" stroke="#c9a14a" strokeWidth="0.4" opacity="0.45" />
    </svg>
  );
}

interface EventLogProps {
  messages: { id: number; text: string }[];
}

export default function EventLog({ messages }: EventLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="panel-parchment relative flex h-full min-h-0 flex-col overflow-hidden rounded-sm">
      <C x="l" y="t" /><C x="r" y="t" /><C x="l" y="b" /><C x="r" y="b" />

      {/* Header */}
      <div className="relative shrink-0 border-b border-[#4a3018] px-5 py-3">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#c9a14a]/30 to-transparent" aria-hidden />
        <h2
          className="text-xs font-semibold tracking-[0.22em] uppercase text-[#f1d27a]"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          Raven Dispatches
        </h2>
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-[#c9a14a]/15 to-transparent" aria-hidden />
      </div>

      {/* Message stream */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="flex flex-col gap-2.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="raven-in flex gap-2.5 items-start rounded-sm border border-[#3d2810] bg-[#180f07]/70 px-3 py-2"
              style={{
                boxShadow: "inset 0 1px 0 rgba(201,161,74,0.06), inset 0 -1px 0 rgba(0,0,0,0.3)",
              }}
            >
              <RavenFeather />
              <p
                className="text-sm leading-relaxed text-foreground/88"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {msg.text}
              </p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

export default function TypingAnimation() {
  const [state, setState] = useState<"idle" | "doing" | "pause1" | "what" | "pause2" | "matters" | "dots">("idle");

  useEffect(() => {
    const timeline: { delay: number; newState: typeof state }[] = [
      { delay: 500, newState: "doing" },
      { delay: 500 + 200 * 5, newState: "pause1" },
      { delay: 500 + 200 * 5 + 1500, newState: "what" },
      { delay: 500 + 200 * 5 + 1500 + 200 * 4, newState: "pause2" },
      { delay: 500 + 200 * 5 + 1500 + 200 * 4 + 1200, newState: "matters" },
      { delay: 500 + 200 * 5 + 1500 + 200 * 4 + 1200 + 200 * 7, newState: "dots" },
    ];

    const timeouts = timeline.map(({ delay, newState }) =>
      setTimeout(() => setState(newState), delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);

  const showDoing = ["doing", "pause1", "what", "pause2", "matters", "dots"].includes(state);
  const showWhat = ["what", "pause2", "matters", "dots"].includes(state);
  const showMatters = ["matters", "dots"].includes(state);
  const showDots = state === "dots";

  return (
    <div className="sidebar-tagline">
      {showDoing && "DOING "}
      <span style={{ color: "#f4dc17" }}>
        {showWhat && "WHAT "}
        {showMatters && "MATTERS"}
      </span>
      {showDots && (
        <>
          <span style={{ color: "#f4dc17" }}>.</span>
          <span style={{ color: "#f4dc17" }}>.</span>
          <span style={{
            display: "inline-block",
            color: "#f4dc17",
            animation: "dot-pulse 1.5s infinite"
          }}>
            .
          </span>
        </>
      )}
      {showDots && (
        <span style={{
          display: "inline-block",
          marginLeft: "2px",
          animation: "cursor-blink 1s infinite",
          color: "#f4dc17"
        }}>
          |
        </span>
      )}
      <style>{`
        @keyframes cursor-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

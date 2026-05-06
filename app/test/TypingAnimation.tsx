"use client";

import { useState, useEffect } from "react";

export default function TypingAnimation() {
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<"doing" | "pause1" | "what" | "pause2" | "matters" | "done">("doing");

  const fullSequence = [
    { text: "DOING ", phase: "doing" as const, typingTime: 200, pauseAfter: 1500 },
    { text: "WHAT ", phase: "what" as const, typingTime: 200, pauseAfter: 1200 },
    { text: "MATTERS", phase: "matters" as const, typingTime: 200, pauseAfter: 0 },
  ];

  useEffect(() => {
    let totalDelay = 800;
    const timeouts: NodeJS.Timeout[] = [];

    fullSequence.forEach((section, idx) => {
      const startDelay = totalDelay;
      for (let i = 1; i <= section.text.length; i++) {
        const charDelay = startDelay + (i - 1) * section.typingTime;
        timeouts.push(
          setTimeout(() => {
            setPhase(section.phase);
            setCharCount(i);
          }, charDelay)
        );
      }
      totalDelay += section.text.length * section.typingTime + section.pauseAfter;
    });

    const finalTimeout = setTimeout(() => setPhase("done"), totalDelay);
    timeouts.push(finalTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, []);

  const doingText = "DOING ";
  const whatText = "WHAT ";
  const mattersText = "MATTERS";

  let displayed = "";
  if (["doing", "pause1", "what", "pause2", "matters", "done"].includes(phase)) {
    displayed += doingText;
  }
  if (["what", "pause2", "matters", "done"].includes(phase)) {
    displayed += whatText.slice(0, phase === "what" ? charCount - doingText.length : whatText.length);
  }
  if (["matters", "done"].includes(phase)) {
    displayed += mattersText.slice(
      0,
      phase === "matters" ? charCount - doingText.length - whatText.length : mattersText.length
    );
  }

  const beforeYellow = "DOING ";
  const yellowPart = displayed.slice(beforeYellow.length);

  return (
    <div className="sidebar-tagline">
      {displayed.slice(0, beforeYellow.length)}
      <span style={{ color: "#f4dc17" }}>{yellowPart}</span>
      {phase === "done" && (
        <>
          <span style={{ color: "#f4dc17" }}>.</span>
          <span style={{ color: "#f4dc17" }}>.</span>
          <span
            style={{
              display: "inline-block",
              color: "#f4dc17",
              animation: "dot-pulse 1.5s infinite",
            }}
          >
            .
          </span>
          <span
            style={{
              display: "inline-block",
              marginLeft: "2px",
              animation: "cursor-blink 1s infinite",
              color: "#f4dc17",
            }}
          >
            |
          </span>
        </>
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

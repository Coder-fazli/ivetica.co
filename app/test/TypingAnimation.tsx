"use client";

import { useState, useEffect } from "react";

type Props = { text?: string };

export default function TypingAnimation({ text = "DOING WHAT MATTERS" }: Props) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);

    const words = text.trim().toUpperCase().split(/\s+/).filter(Boolean);
    const CHAR_MS = 200;
    const WORD_PAUSE = 900;
    const INITIAL_DELAY = 800;

    const timeouts: NodeJS.Timeout[] = [];
    let delay = INITIAL_DELAY;
    let built = "";

    words.forEach((word, wi) => {
      const isLast = wi === words.length - 1;
      const chunk = isLast ? word : word + " ";

      for (let i = 1; i <= chunk.length; i++) {
        const snap = built + chunk.slice(0, i);
        timeouts.push(setTimeout(() => setDisplayed(snap), delay));
        delay += CHAR_MS;
      }

      built += chunk;
      if (!isLast) delay += WORD_PAUSE;
    });

    timeouts.push(setTimeout(() => setDone(true), delay + CHAR_MS));

    return () => timeouts.forEach(clearTimeout);
  }, [text]);

  // First word stays in default color, rest turns yellow
  const upper = text.trim().toUpperCase();
  const firstSpace = upper.indexOf(" ");
  const splitAt = firstSpace === -1 ? upper.length : firstSpace + 1;

  const whiteChars = displayed.slice(0, splitAt);
  const yellowChars = displayed.slice(splitAt);
  const isTyping = displayed.length < upper.length;

  return (
    <div className="sidebar-tagline">
      {whiteChars}
      <span style={{ color: "#f4dc17" }}>{yellowChars}</span>
      {isTyping && (
        <span style={{ display: "inline-block", animation: "cursor-blink 1s infinite", color: "#f4dc17" }}>|</span>
      )}
      {done && (
        <>
          <span style={{ display: "inline-block", color: "#f4dc17", animation: "dot-pulse 1.5s infinite" }}>.</span>
          <span style={{ display: "inline-block", marginLeft: "2px", animation: "cursor-blink 1s infinite", color: "#f4dc17" }}>|</span>
        </>
      )}
      <style>{`
        @keyframes cursor-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes dot-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  );
}

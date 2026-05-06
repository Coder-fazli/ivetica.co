"use client";

import { useState, useEffect } from "react";

export default function TypingAnimation() {
  const [charCount, setCharCount] = useState(0);
  const fullText = "DOING WHAT MATTERS";
  const dots = "...";

  useEffect(() => {
    const startDelay = setTimeout(() => {
      let count = 0;
      const typeInterval = setInterval(() => {
        count++;
        setCharCount(count);
        if (count >= fullText.length) {
          clearInterval(typeInterval);
        }
      }, 200);

      return () => clearInterval(typeInterval);
    }, 800);

    return () => clearTimeout(startDelay);
  }, []);

  const displayed = fullText.slice(0, charCount);
  const beforeMatters = "DOING WHAT ";
  const mattersPart = displayed.slice(beforeMatters.length);

  return (
    <div className="sidebar-tagline">
      {displayed.slice(0, Math.min(beforeMatters.length, charCount))}
      <span style={{ color: "#f4dc17" }}>
        {mattersPart}
      </span>
      <span style={{
        display: "inline-block",
        marginLeft: "2px",
        animation: "cursor-blink 1s infinite",
        color: "#f4dc17"
      }}>
        |
      </span>
      {charCount >= fullText.length && (
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

"use client";

import { useState, useEffect } from "react";

export default function TypingAnimation() {
  const [charCount, setCharCount] = useState(0);
  const fullText = "DOING WHAT MATTERS";

  useEffect(() => {
    const startDelay = setTimeout(() => {
      let count = 0;
      const typeInterval = setInterval(() => {
        count++;
        setCharCount(count);
        if (count >= fullText.length) clearInterval(typeInterval);
      }, 50);

      return () => clearInterval(typeInterval);
    }, 1000);

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
    </div>
  );
}

"use client";

import { useEffect, useCallback } from "react";

type LightboxItem = { url: string; kind: "image" | "video" };

type Props = {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onNav: (index: number) => void;
};

export default function Lightbox({ items, index, onClose, onNav }: Props) {
  const prev = useCallback(() => onNav((index - 1 + items.length) % items.length), [index, items.length, onNav]);
  const next = useCallback(() => onNav((index + 1) % items.length), [index, items.length, onNav]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  const item = items[index];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.92)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 16, right: 16,
          width: 40, height: 40, borderRadius: "50%",
          background: "rgba(255,255,255,0.12)", border: "none",
          color: "#fff", fontSize: 20, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 2,
        }}
      >×</button>

      {/* Media */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90vw", maxWidth: 1100,
          maxHeight: "82vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}
      >
        {item.kind === "video" ? (
          <video
            key={item.url}
            src={item.url}
            controls
            autoPlay
            style={{ maxWidth: "100%", maxHeight: "82vh", borderRadius: 10, display: "block" }}
          />
        ) : (
          <img
            src={item.url}
            alt=""
            style={{ maxWidth: "100%", maxHeight: "82vh", borderRadius: 10, display: "block", objectFit: "contain" }}
          />
        )}

        {/* Prev arrow */}
        {items.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            style={{
              position: "absolute", left: -56, top: "50%", transform: "translateY(-50%)",
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(255,255,255,0.12)", border: "none",
              color: "#fff", fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >‹</button>
        )}

        {/* Next arrow */}
        {items.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            style={{
              position: "absolute", right: -56, top: "50%", transform: "translateY(-50%)",
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(255,255,255,0.12)", border: "none",
              color: "#fff", fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >›</button>
        )}
      </div>

      {/* Dots */}
      {items.length > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ display: "flex", gap: 6, marginTop: 20 }}
        >
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => onNav(i)}
              style={{
                width: i === index ? 20 : 8, height: 8,
                borderRadius: 4, border: "none", cursor: "pointer",
                background: i === index ? "#fff" : "rgba(255,255,255,0.3)",
                padding: 0,
                transition: "width 0.2s ease, background 0.2s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

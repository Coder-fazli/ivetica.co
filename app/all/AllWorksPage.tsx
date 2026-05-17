"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { WorkType } from "@/types";

type Tag = { _id: string; name: string };

export default function AllWorksPage({ works, initialTag }: { works: WorkType[]; initialTag?: string }) {
  const router = useRouter();
  const [activeTag, setActiveTag] = useState(initialTag || "All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/tags").then(r => r.json()).then(data => setTags(Array.isArray(data) ? data : []));
  }, []);

  const filtered = activeTag === "All"
    ? works
    : works.filter(w => w.tags?.includes(activeTag));

  function selectTag(tag: string) {
    setActiveTag(tag);
    setDropdownOpen(false);
    const url = tag === "All" ? "/all" : `/all?tag=${encodeURIComponent(tag)}`;
    router.replace(url, { scroll: false });
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "var(--bg, #0d0d0d)",
      color: "var(--text-primary, #efefef)",
      fontFamily: 'Helvetica, Arial, sans-serif',
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      zIndex: 100,
    }}>
      {/* top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px", flexShrink: 0,
        borderBottom: "1px solid #1e1e1e",
      }}>
        {/* tag filter input */}
        <div ref={inputRef} style={{ position: "relative", width: 260 }}>
          <div
            onClick={() => setDropdownOpen(v => !v)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 10, cursor: "pointer",
              background: "var(--card-bg, #1a1a1a)",
              borderRadius: 10,
              padding: "11px 16px",
            }}
          >
            <span style={{ fontSize: 14, color: activeTag === "All" ? "rgba(255,255,255,0.3)" : "var(--text-primary, #efefef)" }}>
              {activeTag === "All" ? "I want to see..." : activeTag}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.35, flexShrink: 0 }}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>

          {dropdownOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
              background: "var(--card-bg, #1a1a1a)",
              borderRadius: 10, padding: "6px 0",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              zIndex: 10,
            }}>
              <button
                onClick={() => selectTag("All")}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "9px 18px", background: "none", border: "none",
                  color: activeTag === "All" ? "#efefef" : "#555",
                  fontSize: 14, cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: activeTag === "All" ? 500 : 400,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#efefef")}
                onMouseLeave={e => (e.currentTarget.style.color = activeTag === "All" ? "#efefef" : "#555")}
              >
                All
              </button>
              {tags.map(tag => (
                <button
                  key={tag._id}
                  onClick={() => selectTag(tag.name)}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "9px 18px", background: "none", border: "none",
                    color: activeTag === tag.name ? "#efefef" : "#555",
                    fontSize: 14, cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: activeTag === tag.name ? 500 : 400,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#efefef")}
                  onMouseLeave={e => (e.currentTarget.style.color = activeTag === tag.name ? "#efefef" : "#555")}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* close */}
        <button
          onClick={() => router.push("/")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#efefef", opacity: 0.4, fontSize: 22, lineHeight: 1, padding: 4 }}
        >
          ×
        </button>
      </div>

      {/* grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 40px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 8,
          alignItems: "start",
        }}>
          {filtered.map((work) => (
            <a
              key={work.slug}
              href={`/${work.slug}`}
              style={{ display: "block", textDecoration: "none", color: "inherit" }}
            >
              {(work.coverImage || work.thumbnail)
                ? (() => {
                  const src = work.coverImage || work.thumbnail || "";
                  const isGif = src.toLowerCase().includes(".gif");
                  return isGif
                    ? <img src={src} alt={work.title} loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block", borderRadius: 8 }} />
                    : <Image src={src} alt={work.title} width={400} height={300} loading="lazy" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ width: "100%", height: "auto", display: "block", borderRadius: 8 }} />;
                })()
                : <div style={{ width: "100%", aspectRatio: "4/3", background: "#1a1a1a", borderRadius: 8 }} />
              }
              <div style={{ padding: "10px 4px 0", marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary, #efefef)", marginBottom: 2 }}>{work.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted, #555)" }}>{work.client}</div>
              </div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px", opacity: 0.3, fontSize: 13 }}>
            No works found for &quot;{activeTag}&quot;
          </div>
        )}
      </div>
    </div>
  );
}

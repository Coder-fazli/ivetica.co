"use client";

import { useEffect, useState } from "react";
import { getWorkBySlug } from "@/actions/works";
import { WorkType } from "@/types";
import VideoPlayer from "@/components/works/VideoPlayer";
import "@/components/works/works.css";

export default function WorkDetail({ slug, fading }: { slug: string; fading: boolean }) {
  const [work, setWork] = useState<WorkType | null>(null);

  useEffect(() => {
    if (!slug) return;
    setWork(null);
    getWorkBySlug(slug).then(w => { if (w) setWork(w); });
  }, [slug]);

  if (!work) return <div style={{ padding: 40, opacity: 0.3, fontSize: 13 }}>Loading...</div>;

  function renderMedia(url: string, kind: string, className = "") {
    return kind === "video"
      ? <VideoPlayer src={url} className={className} />
      : <img src={url} alt="" className={className} />;
  }

  return (
    <div className={`work-detail-panel${fading ? " fade" : ""}`}>
      {/* hero thumbnail */}
      {work.thumbnail && (
        <img src={work.thumbnail} alt={work.title} className="main-hero" />
      )}

      <div className="main-body">
        <div className="main-label">{work.client}</div>
        <h1 className="main-title"><strong>{work.title}</strong></h1>

        {/* content blocks */}
        {work.blocks && work.blocks.length > 0 && (
          <div className="work-blocks">
            {work.blocks.map((block, idx) => {
              if (block.type === "full-media") return (
                <div key={idx} className="work-block work-block-full">
                  {renderMedia(block.media.url, block.media.kind, "work-block-media")}
                </div>
              );
              if (block.type === "portrait-media") return (
                <div key={idx} className="work-block work-block-portrait">
                  {renderMedia(block.media.url, block.media.kind, "work-block-media")}
                </div>
              );
              if (block.type === "two-column") return (
                <div key={idx} className="work-block work-block-two-col">
                  {renderMedia(block.left.url, block.left.kind, "work-block-media")}
                  {renderMedia(block.right.url, block.right.kind, "work-block-media")}
                </div>
              );
              if (block.type === "text") return (
                <div key={idx} className="work-block work-block-text">
                  {block.label && <span className="work-block-label">{block.label}</span>}
                  <p className="work-block-body">{block.body}</p>
                </div>
              );
              if (block.type === "text-full") return (
                <div key={idx} className="work-block work-block-text-full">
                  {block.label && <span className="work-block-label">{block.label}</span>}
                  <p className="work-block-body">{block.body}</p>
                </div>
              );
              if (block.type === "text-two-col") return (
                <div key={idx} className="work-block work-block-text-two-col">
                  <div>
                    {block.leftLabel && <span className="work-block-label">{block.leftLabel}</span>}
                    <p className="work-block-body">{block.leftBody}</p>
                  </div>
                  <div>
                    {block.rightLabel && <span className="work-block-label">{block.rightLabel}</span>}
                    <p className="work-block-body">{block.rightBody}</p>
                  </div>
                </div>
              );
              if (block.type === "media-text") return (
                <div key={idx} className="work-block work-block-media-text">
                  {renderMedia(block.media.url, block.media.kind, "work-block-media")}
                  <p className="work-block-body">{block.body}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

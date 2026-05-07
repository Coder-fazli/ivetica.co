"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getWorkBySlug } from "@/actions/works";
import { WorkType, Block } from "@/types";
import VideoPlayer from "@/components/works/VideoPlayer";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import Lightbox from "@/components/works/Lightbox";
import { VideoProvider } from "@/components/works/VideoContext";
import "@/components/works/works.css";

type LightboxItem = { url: string; kind: "image" | "video" };

function collectMedia(blocks: Block[]): LightboxItem[] {
  const items: LightboxItem[] = [];
  for (const block of blocks) {
    if (block.type === "full-media" || block.type === "portrait-media") {
      if (block.media.kind !== "text") items.push({ url: block.media.url, kind: block.media.kind });
    } else if (block.type === "two-column" || block.type === "two-column-4-5" || block.type === "two-column-1-1") {
      if (block.left.kind !== "text") items.push({ url: block.left.url, kind: block.left.kind });
      if (block.right.kind !== "text") items.push({ url: block.right.url, kind: block.right.kind });
    } else if (block.type === "media-text") {
      if (block.media.kind !== "text") items.push({ url: block.media.url, kind: block.media.kind });
    }
  }
  return items;
}

export default function WorkDetail({ slug, fading }: { slug: string; fading: boolean }) {
  const [work, setWork] = useState<WorkType | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    setWork(null);
    getWorkBySlug(slug).then(w => { if (w) setWork(w); });
  }, [slug]);

  const allMedia = useMemo(() => work?.blocks ? collectMedia(work.blocks) : [], [work]);

  const openLightbox = useCallback((url: string) => {
    const idx = allMedia.findIndex(m => m.url === url);
    if (idx !== -1) setLightboxIndex(idx);
  }, [allMedia]);

  if (!work) return <div style={{ padding: 40, opacity: 0.3, fontSize: 13 }}>Loading...</div>;

  function renderMedia(url: string, kind: string, className = "") {
    const clickable = kind !== "text";
    return kind === "video"
      ? (
        <div
          onClick={clickable ? () => openLightbox(url) : undefined}
          style={clickable ? { cursor: "zoom-in" } : undefined}
        >
          <VideoPlayer src={url} className={className} />
        </div>
      )
      : (
        <ImageWithSkeleton
          src={url}
          alt=""
          className={className}
          onClick={clickable ? () => openLightbox(url) : undefined}
          style={clickable ? { cursor: "zoom-in" } : undefined}
        />
      );
  }

  return (
    <VideoProvider>
      <div className={`work-detail-panel${fading ? " fade" : ""}`}>
        <div className="main-body">
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
                if (block.type === "two-column-4-5") return (
                  <div key={idx} className="work-block work-block-two-col-4-5">
                    {renderMedia(block.left.url, block.left.kind, "work-block-media")}
                    {renderMedia(block.right.url, block.right.kind, "work-block-media")}
                  </div>
                );
                if (block.type === "two-column-1-1") return (
                  <div key={idx} className="work-block work-block-two-col-1-1">
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

      {lightboxIndex !== null && (
        <Lightbox
          items={allMedia}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNav={setLightboxIndex}
        />
      )}
    </VideoProvider>
  );
}

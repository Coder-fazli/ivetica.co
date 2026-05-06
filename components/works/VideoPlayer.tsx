"use client";

import { useRef, useState, useEffect } from "react";
import { useVideoContext } from "./VideoContext";

type Props = {
  src: string;
  className?: string;
};

function getPreviewUrl(url: string): string {
  if (url.includes("res.cloudinary.com") && url.includes("/video/upload/")) {
    return url.replace("/video/upload/", "/video/upload/du_15,q_auto,f_auto/");
  }
  return url;
}

let videoIdCounter = 0;

export default function VideoPlayer({ src, className = "" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoId] = useState(() => `video-${videoIdCounter++}`);
  const { hoveredVideoId, setHoveredVideoId, registerVideo, unregisterVideo } = useVideoContext();

  useEffect(() => {
    registerVideo(videoId);
    return () => unregisterVideo(videoId);
  }, [videoId, registerVideo, unregisterVideo]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (hoveredVideoId === null) {
      video.play().catch(() => {});
    } else if (hoveredVideoId === videoId) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [hoveredVideoId, videoId]);

  function toggleSound(e: React.MouseEvent) {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", borderRadius: 10, width: "100%", height: "100%" }}
      onMouseEnter={() => setHoveredVideoId(videoId)}
      onMouseLeave={() => setHoveredVideoId(null)}
    >
      {active && (
        <>
          {isLoading && (
            <div style={{
              position: "absolute", inset: 0,
              background: "#0d0d0d",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 1,
              borderRadius: 10
            }}>
              <div style={{
                width: 40, height: 40,
                border: "3px solid rgba(255,255,255,0.1)",
                borderTop: "3px solid rgba(255,255,255,0.4)",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }} />
            </div>
          )}
          <video
            ref={videoRef}
            src={getPreviewUrl(src)}
            muted
            loop
            playsInline
            preload="metadata"
            onCanPlay={() => setIsLoading(false)}
            onLoadedMetadata={() => setIsLoading(false)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </>
      )}
      <button
        onClick={toggleSound}
        style={{
          position: "absolute",
          bottom: 14,
          right: 14,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.5)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        )}
      </button>
    </div>
  );
}

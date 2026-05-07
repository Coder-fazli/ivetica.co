"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

type VideoContextType = {
  hoveredVideoId: string | null;
  lastHoveredVideoId: string | null;
  setHoveredVideoId: (id: string | null) => void;
  registerVideo: (id: string) => void;
  unregisterVideo: (id: string) => void;
};

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [hoveredVideoId, setHoveredVideoIdState] = useState<string | null>(null);
  const [lastHoveredVideoId, setLastHoveredVideoId] = useState<string | null>(null);
  const [videoIds] = useState<Set<string>>(new Set());
  const hoveredRef = useRef<string | null>(null);
  const clearTimerRef = useRef<NodeJS.Timeout | null>(null);

  const setHoveredVideoId = useCallback((id: string | null) => {
    // Cancel any pending "go to null" — user is hovering a new video
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }

    if (id === null) {
      // Delay the null state so a quick mouseEnter on another video can cancel it
      clearTimerRef.current = setTimeout(() => {
        hoveredRef.current = null;
        setLastHoveredVideoId(null);
        setHoveredVideoIdState(null);
      }, 60);
    } else {
      const prev = hoveredRef.current;
      hoveredRef.current = id;
      if (prev !== null && prev !== id) {
        setLastHoveredVideoId(prev);
      }
      setHoveredVideoIdState(id);
    }
  }, []);

  const registerVideo = useCallback((id: string) => {
    videoIds.add(id);
  }, [videoIds]);

  const unregisterVideo = useCallback((id: string) => {
    videoIds.delete(id);
  }, [videoIds]);

  return (
    <VideoContext.Provider value={{ hoveredVideoId, lastHoveredVideoId, setHoveredVideoId, registerVideo, unregisterVideo }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoContext() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideoContext must be used within VideoProvider");
  }
  return context;
}

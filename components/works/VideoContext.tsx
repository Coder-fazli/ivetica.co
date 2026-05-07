"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

type VideoContextType = {
  hoveredVideoId: string | null;
  setHoveredVideoId: (id: string | null) => void;
  registerVideo: (id: string) => void;
  unregisterVideo: (id: string) => void;
};

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [hoveredVideoId, setHoveredVideoIdState] = useState<string | null>(null);
  const [videoIds] = useState<Set<string>>(new Set());
  const clearTimerRef = useRef<NodeJS.Timeout | null>(null);

  const setHoveredVideoId = useCallback((id: string | null) => {
    // Cancel any pending "go to null" — user is hovering a new video
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }

    if (id === null) {
      // Small debounce so quick mouse moves between videos don't flicker through default state
      clearTimerRef.current = setTimeout(() => {
        setHoveredVideoIdState(null);
      }, 60);
    } else {
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
    <VideoContext.Provider value={{ hoveredVideoId, setHoveredVideoId, registerVideo, unregisterVideo }}>
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

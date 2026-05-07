"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

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

  const setHoveredVideoId = useCallback((id: string | null) => {
    setHoveredVideoIdState(prev => {
      if (id === null) {
        setLastHoveredVideoId(null);
      } else if (prev !== null && prev !== id) {
        setLastHoveredVideoId(prev);
      }
      return id;
    });
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

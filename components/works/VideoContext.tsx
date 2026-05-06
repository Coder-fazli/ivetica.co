"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type VideoContextType = {
  hoveredVideoId: string | null;
  setHoveredVideoId: (id: string | null) => void;
  registerVideo: (id: string) => void;
  unregisterVideo: (id: string) => void;
};

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const [videoIds] = useState<Set<string>>(new Set());

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

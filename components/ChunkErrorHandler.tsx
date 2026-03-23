"use client";
import { useEffect } from "react";

export default function ChunkErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const isChunkError =
        event.message?.includes("ChunkLoadError") ||
        event.message?.includes("Loading chunk") ||
        event.message?.includes("Failed to load chunk");

      if (isChunkError) {
        const key = "chunk_reload_attempted";
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, "1");
          window.location.reload();
        } else {
          sessionStorage.removeItem(key);
        }
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  return null;
}

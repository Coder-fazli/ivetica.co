import { useState, useCallback } from "react";

export function useImageLoading() {
  const [isLoading, setIsLoading] = useState(true);

  const onLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const onError = useCallback(() => {
    setIsLoading(false);
  }, []);

  return { isLoading, onLoad, onError };
}

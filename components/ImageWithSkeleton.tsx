"use client";

import { useState } from "react";
import SkeletonLoader from "./SkeletonLoader";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function ImageWithSkeleton({
  src,
  alt,
  className = "",
  style,
  onClick,
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
      {isLoading && (
        <SkeletonLoader
          width="100%"
          height="400px"
          borderRadius="8px"
          className="image-skeleton"
        />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          ...style,
          display: isLoading ? "none" : "block",
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        onClick={onClick}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import SkeletonLoader from "./SkeletonLoader";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  width?: number;
  height?: number;
}

export default function ImageWithSkeleton({
  src,
  alt,
  className = "",
  style,
  onClick,
  width,
  height,
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const useFill = !width || !height;

  return (
    <div style={{ position: "relative", display: "block", width: "100%" }}>
      {isLoading && (
        <SkeletonLoader
          width="100%"
          height="400px"
          borderRadius="8px"
          className="image-skeleton"
        />
      )}
      {useFill ? (
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={1200}
          className={className}
          sizes="(max-width: 768px) 100vw, 80vw"
          style={{
            ...style,
            width: "100%",
            height: "auto",
            display: isLoading ? "none" : "block",
          }}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
          onClick={onClick}
          unoptimized={src.includes(".gif")}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          style={{
            ...style,
            display: isLoading ? "none" : "block",
          }}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
          onClick={onClick}
          unoptimized={src.includes(".gif")}
        />
      )}
    </div>
  );
}

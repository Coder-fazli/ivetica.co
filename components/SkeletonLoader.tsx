"use client";

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export default function SkeletonLoader({
  width = "100%",
  height = "300px",
  borderRadius = "8px",
  className = "",
}: SkeletonLoaderProps) {
  const widthStr = typeof width === "number" ? `${width}px` : width;
  const heightStr = typeof height === "number" ? `${height}px` : height;
  const radiusStr = typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;

  return (
    <div
      className={`skeleton-loader ${className}`}
      style={{
        width: widthStr,
        height: heightStr,
        borderRadius: radiusStr,
        background: "linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-shimmer 2s infinite",
      }}
    />
  );
}

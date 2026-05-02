"use client";

import MediaPicker from "./MediaPicker";
import { MediaItem } from "@/types";

type Props = {
  value: MediaItem;
  onChange: (val: MediaItem) => void;
  label?: string;
};

export default function MediaUpload({ value, onChange, label }: Props) {
  return <MediaPicker value={value} onChange={onChange} label={label} />;
}

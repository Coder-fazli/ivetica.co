"use client";

import { useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export default function ImageUpload({ value, onChange, label = "Image" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const sigRes = await fetch("/api/upload-signature");
      if (!sigRes.ok) throw new Error("Failed to get upload signature");
      const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", apiKey);
      form.append("timestamp", String(timestamp));
      form.append("signature", signature);
      form.append("folder", "lvetica");

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: form,
      });
      const json = await res.json();

      if (!res.ok || !json.secure_url) {
        setError(json.error?.message || "Upload failed");
      } else {
        onChange(json.secure_url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="admin-field-group">
      <label>{label}</label>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {value && (
          <img
            src={value}
            alt="preview"
            style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 4, border: "1px solid rgba(0,0,0,0.1)" }}
          />
        )}
        <div style={{ flex: 1, minWidth: 200 }}>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="admin-input"
            placeholder="Paste URL or upload below"
            style={{ marginBottom: 6 }}
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFile}
            style={{ display: "none" }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="admin-btn-add"
            style={{ marginTop: 0 }}
          >
            {uploading ? "Uploading..." : "Upload image"}
          </button>
          {error && <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

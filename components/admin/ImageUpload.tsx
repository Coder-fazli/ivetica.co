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
      const sigRes = await fetch("/api/r2-presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      if (!sigRes.ok) {
        const j = await sigRes.json().catch(() => ({}));
        throw new Error(j.error || "Failed to get upload URL");
      }
      const { uploadUrl, publicUrl } = await sigRes.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error(`R2 upload failed (HTTP ${putRes.status})`);
      onChange(publicUrl);
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

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
  const [activeTab, setActiveTab] = useState<"existing" | "upload">(value ? "existing" : "upload");

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
      setActiveTab("existing");
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
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => setActiveTab("existing")}
          style={{
            padding: "6px 12px",
            fontSize: 12,
            background: activeTab === "existing" ? "var(--admin-btn-bg)" : "transparent",
            color: activeTab === "existing" ? "#fff" : "#aaa",
            border: `1px solid ${activeTab === "existing" ? "var(--admin-btn-bg)" : "var(--admin-input-border)"}`,
            borderRadius: 4,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Existing Media
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          style={{
            padding: "6px 12px",
            fontSize: 12,
            background: activeTab === "upload" ? "var(--admin-btn-bg)" : "transparent",
            color: activeTab === "upload" ? "#fff" : "#aaa",
            border: `1px solid ${activeTab === "upload" ? "var(--admin-btn-bg)" : "var(--admin-input-border)"}`,
            borderRadius: 4,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Upload New
        </button>
      </div>

      {activeTab === "existing" && (
        <div style={{ minHeight: 140, background: "var(--admin-card)", padding: 16, borderRadius: 6, border: "1px solid var(--admin-input-border)" }}>
          {value ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <img
                src={value}
                alt="preview"
                style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 4 }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  style={{
                    padding: "6px 12px",
                    fontSize: 12,
                    background: "transparent",
                    color: "#e53",
                    border: "1px solid #e53",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  style={{
                    padding: "6px 12px",
                    fontSize: 12,
                    background: "transparent",
                    border: "1px solid var(--admin-input-border)",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Replace
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 140, color: "#666", fontSize: 13 }}>
              No media selected. Upload one to get started.
            </div>
          )}
        </div>
      )}

      {activeTab === "upload" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFile}
            style={{ display: "none" }}
          />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="admin-input"
            placeholder="Paste image URL or upload below"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="admin-btn-add"
            style={{ marginTop: 0 }}
          >
            {uploading ? "Uploading..." : "Choose file"}
          </button>
          {error && <p style={{ color: "#e53", fontSize: 12 }}>{error}</p>}
        </div>
      )}
    </div>
  );
}

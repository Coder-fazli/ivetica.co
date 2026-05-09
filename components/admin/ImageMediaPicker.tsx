"use client";

import { useRef, useState, useEffect, useCallback } from "react";

type UploadedAsset = {
  url: string;
  name: string;
  createdAt: string;
};

type ApiAsset = {
  url: string;
  kind: "image" | "video";
  createdAt: string;
};

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  compact?: boolean;
  accept?: "image" | "all";
};

export default function ImageMediaPicker({ value, onChange, label = "Image", compact = false, accept = "image" }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/r2-media");
      const data = await res.json();
      const filtered = Array.isArray(data) ? (accept === "all" ? data : data.filter((a: ApiAsset) => a.kind === "image")) : [];
      setAssets(filtered.map((a: ApiAsset) => ({ url: a.url, name: a.url.split("/").pop() || "media", createdAt: a.createdAt })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && tab === "library") fetchAssets();
  }, [open, tab, fetchAssets]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError("");

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

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`R2 upload failed (HTTP ${xhr.status})`));
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.ontimeout = () => reject(new Error("Upload timed out"));
        xhr.send(file);
      });

      onChange(publicUrl);
      setOpen(false);
      fetchAssets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      {compact ? (
        <div>
          {label && <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: 6 }}>{label}</div>}
          <div
            onClick={() => setOpen(true)}
            style={{
              width: "100%", aspectRatio: "1", borderRadius: 6, overflow: "hidden",
              border: "1px solid var(--admin-input-border)", cursor: "pointer",
              background: "var(--admin-input-bg)", position: "relative",
            }}
          >
            {value
              ? <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 4, opacity: 0.3 }}>
                  <span style={{ fontSize: 22 }}>+</span>
                  <span style={{ fontSize: 10 }}>Choose photo</span>
                </div>
            }
            {value && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 6, opacity: 0, transition: "opacity 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
              >
                <span style={{ fontSize: 10, background: "rgba(0,0,0,0.65)", color: "#fff", borderRadius: 4, padding: "2px 7px" }}>Change</span>
              </div>
            )}
          </div>
          {value && (
            <button type="button" onClick={() => onChange("")} style={{ marginTop: 5, fontSize: 10, color: "#e53", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              Remove
            </button>
          )}
        </div>
      ) : (
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
          <div>
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="admin-input"
              placeholder="Paste URL or browse media"
              style={{ marginBottom: 8, minWidth: 200 }}
            />
            <button type="button" onClick={() => setOpen(true)} className="admin-btn-add" style={{ marginTop: 0 }}>
              Browse media
            </button>
          </div>
        </div>
      </div>
      )}

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: "var(--admin-card)",
              borderRadius: 8,
              width: "90%",
              maxWidth: 800,
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              border: "1px solid var(--admin-input-border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: 16, borderBottom: "1px solid var(--admin-input-border)", display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => setTab("library")}
                style={{
                  padding: "6px 12px",
                  fontSize: 12,
                  background: tab === "library" ? "var(--admin-btn-bg)" : "transparent",
                  color: tab === "library" ? "#fff" : "#aaa",
                  border: `1px solid ${tab === "library" ? "var(--admin-btn-bg)" : "var(--admin-input-border)"}`,
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Library
              </button>
              <button
                type="button"
                onClick={() => setTab("upload")}
                style={{
                  padding: "6px 12px",
                  fontSize: 12,
                  background: tab === "upload" ? "var(--admin-btn-bg)" : "transparent",
                  color: tab === "upload" ? "#fff" : "#aaa",
                  border: `1px solid ${tab === "upload" ? "var(--admin-btn-bg)" : "var(--admin-input-border)"}`,
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Upload
              </button>
            </div>

            <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
              {tab === "library" && (
                <>
                  {loading ? (
                    <p style={{ color: "#666", fontSize: 13 }}>Loading images...</p>
                  ) : assets.length === 0 ? (
                    <p style={{ color: "#666", fontSize: 13 }}>No images found. Upload one to get started.</p>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
                      {assets.map((asset) => (
                        <div
                          key={asset.url}
                          onClick={() => {
                            onChange(asset.url);
                            setOpen(false);
                          }}
                          style={{
                            cursor: "pointer",
                            borderRadius: 4,
                            overflow: "hidden",
                            border: value === asset.url ? "2px solid #f4dc17" : "1px solid var(--admin-input-border)",
                            transition: "all 0.2s",
                          }}
                        >
                          {asset.url.match(/\.(mp4|webm|mov)$/i)
                            ? <video src={asset.url} style={{ width: "100%", height: 120, objectFit: "cover" }} muted />
                            : <img src={asset.url} alt={asset.name} style={{ width: "100%", height: 120, objectFit: "cover" }} />
                          }
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {tab === "upload" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input ref={inputRef} type="file" accept={accept === "all" ? "image/*,video/*,.gif" : "image/*"} onChange={handleUpload} style={{ display: "none" }} />
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="admin-btn-add"
                    style={{ marginTop: 0 }}
                  >
                    {uploading ? `Uploading ${progress}%` : "Choose file"}
                  </button>
                  {error && <p style={{ color: "#e53", fontSize: 12 }}>{error}</p>}
                </div>
              )}
            </div>

            <div style={{ padding: 12, borderTop: "1px solid var(--admin-input-border)", textAlign: "right" }}>
              <button type="button" onClick={() => setOpen(false)} className="admin-btn" style={{ padding: "8px 16px" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

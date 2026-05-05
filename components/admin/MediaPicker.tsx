"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { MediaItem } from "@/types";

type CloudinaryAsset = {
  url: string;
  publicId: string;
  kind: "image" | "video";
  bytes: number;
  createdAt: string;
};

type Props = {
  value: MediaItem;
  onChange: (val: MediaItem) => void;
  label?: string;
};

export default function MediaPicker({ value, onChange, label = "Media" }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [assets, setAssets] = useState<CloudinaryAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [selected, setSelected] = useState<CloudinaryAsset | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setAssets(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchAssets();
  }, [open, fetchAssets]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setError("");
    try {
      const kind: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";
      const form = new FormData();
      form.append("file", file);

      const result = await new Promise<{ url: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/upload");
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () => {
          let json: { url?: string; error?: string } = {};
          try { json = JSON.parse(xhr.responseText || "{}"); } catch {
            return reject(new Error(`Server error (HTTP ${xhr.status}): empty or invalid response. File likely too large or server timed out.`));
          }
          if (xhr.status === 200 && json.url) resolve(json as { url: string });
          else reject(new Error(json.error || `Upload failed (HTTP ${xhr.status})`));
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.ontimeout = () => reject(new Error("Upload timed out"));
        xhr.send(form);
      });

      onChange({ url: result.url, kind });
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

  function confirmSelection() {
    if (!selected) return;
    onChange({ url: selected.url, kind: selected.kind });
    setOpen(false);
    setSelected(null);
  }

  const filtered = assets.filter(a => filter === "all" || a.kind === filter);

  return (
    <>
      {/* trigger */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {value.url && (
          value.kind === "video"
            ? <video src={value.url} style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} muted />
            : <img src={value.url} alt="" style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
        )}
        <div style={{ flex: 1 }}>
          {label && <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4, marginBottom: 4 }}>{label}</div>}
          <button
            type="button"
            onClick={() => setOpen(true)}
            style={{ fontSize: 12, padding: "5px 12px", borderRadius: 5, border: "1px solid var(--admin-input-border)", background: "var(--admin-input-bg)", cursor: "pointer", color: "inherit" }}
          >
            {value.url ? "Change" : "Choose media"}
          </button>
        </div>
      </div>

      {/* modal */}
      {open && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div style={{ background: "var(--admin-card-bg, #fff)", borderRadius: 10, width: "100%", maxWidth: 880, maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 16px 60px rgba(0,0,0,0.25)" }}>

            {/* header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--admin-input-border)" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {(["library", "upload"] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{ fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 5, border: "none", cursor: "pointer", background: tab === t ? "var(--admin-accent)" : "transparent", color: tab === t ? "#fff" : "inherit", opacity: tab === t ? 1 : 0.5 }}>
                    {t === "library" ? "Media Library" : "Upload New"}
                  </button>
                ))}
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, opacity: 0.4, lineHeight: 1 }}>×</button>
            </div>

            {/* body */}
            <div style={{ flex: 1, overflow: "auto", padding: 16 }}>

              {tab === "library" && (
                <>
                  {/* filter */}
                  <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    {(["all", "image", "video"] as const).map(f => (
                      <button key={f} onClick={() => setFilter(f)} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, border: `1px solid ${filter === f ? "var(--admin-accent)" : "var(--admin-input-border)"}`, cursor: "pointer", background: filter === f ? "var(--admin-accent)" : "transparent", color: filter === f ? "#fff" : "inherit", fontWeight: 500 }}>
                        {f === "all" ? "All" : f === "image" ? "Images" : "Videos"}
                      </button>
                    ))}
                    <span style={{ marginLeft: "auto", fontSize: 11, opacity: 0.4, alignSelf: "center" }}>{filtered.length} files</span>
                  </div>

                  {loading ? (
                    <div style={{ textAlign: "center", padding: 40, opacity: 0.4, fontSize: 13 }}>Loading...</div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
                      {filtered.map(asset => (
                        <div
                          key={asset.publicId}
                          onClick={() => setSelected(asset)}
                          style={{
                            aspectRatio: "1", borderRadius: 6, overflow: "hidden", cursor: "pointer", position: "relative",
                            border: selected?.publicId === asset.publicId ? "2px solid var(--admin-accent)" : "2px solid transparent",
                          }}
                        >
                          {asset.kind === "video" ? (
                            <video src={asset.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                          ) : (
                            <img src={asset.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          )}
                          {asset.kind === "video" && (
                            <div style={{ position: "absolute", bottom: 4, left: 4, background: "rgba(0,0,0,0.6)", borderRadius: 3, padding: "1px 5px", fontSize: 9, color: "#fff" }}>▶</div>
                          )}
                          {selected?.publicId === asset.publicId && (
                            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: 20, color: "#fff" }}>✓</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {tab === "upload" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200, gap: 12 }}>
                  <div
                    onClick={() => inputRef.current?.click()}
                    style={{ width: "100%", maxWidth: 400, border: "2px dashed var(--admin-input-border)", borderRadius: 10, padding: "40px 20px", textAlign: "center", cursor: "pointer" }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>↑</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{uploading ? (progress === 100 ? "Processing on server..." : `Uploading ${progress}%`) : "Click to upload"}</div>
                    <div style={{ fontSize: 11, opacity: 0.4 }}>Images or videos</div>
                    {uploading && (
                      <div style={{ width: "100%", height: 3, background: "rgba(0,0,0,0.1)", borderRadius: 2, marginTop: 10 }}>
                        <div style={{ height: "100%", width: `${progress}%`, background: "var(--admin-accent)", borderRadius: 2, transition: "width 0.2s" }} />
                      </div>
                    )}
                  </div>
                  <input ref={inputRef} type="file" accept="image/*,video/*" onChange={handleUpload} style={{ display: "none" }} />
                  {error && <p style={{ color: "red", fontSize: 12 }}>{error}</p>}
                </div>
              )}
            </div>

            {/* footer */}
            {tab === "library" && (
              <div style={{ display: "flex", gap: 8, padding: "12px 16px", borderTop: "1px solid var(--admin-input-border)", justifyContent: "flex-end" }}>
                <button onClick={() => setOpen(false)} style={{ fontSize: 12, padding: "6px 16px", borderRadius: 5, border: "1px solid var(--admin-input-border)", background: "transparent", cursor: "pointer", color: "inherit" }}>Cancel</button>
                <button onClick={confirmSelection} disabled={!selected} style={{ fontSize: 12, padding: "6px 16px", borderRadius: 5, border: "none", background: "var(--admin-accent)", color: "#fff", cursor: selected ? "pointer" : "not-allowed", opacity: selected ? 1 : 0.4 }}>
                  Insert
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}

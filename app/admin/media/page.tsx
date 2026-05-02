"use client";

import { useEffect, useRef, useState } from "react";

type Asset = {
  url: string;
  publicId: string;
  kind: "image" | "video";
  bytes: number;
  createdAt: string;
};

export default function AdminMedia() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function fetchAssets() {
    setLoading(true);
    const res = await fetch("/api/media");
    const data = await res.json();
    setAssets(data);
    setLoading(false);
  }

  useEffect(() => { fetchAssets(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      const form = new FormData();
      form.append("file", file);
      await fetch("/api/upload", { method: "POST", body: form });
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    fetchAssets();
  }

  async function handleDelete(asset: Asset) {
    if (!confirm("Delete this file?")) return;
    setDeleting(asset.publicId);
    await fetch("/api/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId: asset.publicId, kind: asset.kind }),
    });
    setAssets(prev => prev.filter(a => a.publicId !== asset.publicId));
    setDeleting(null);
  }

  const filtered = assets.filter(a => filter === "all" || a.kind === filter);

  return (
    <>
      <div className="admin-page-header">
        <h1>Media Library</h1>
        <p>All uploaded images and videos</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div style={{ display: "flex", gap: 6 }}>
            {(["all", "image", "video"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`admin-btn ${filter === f ? "admin-btn-primary" : "admin-btn-secondary"}`} style={{ fontSize: 11, padding: "3px 12px" }}>
                {f === "all" ? "All" : f === "image" ? "Images" : "Videos"}
              </button>
            ))}
            <span style={{ fontSize: 12, opacity: 0.4, alignSelf: "center", marginLeft: 8 }}>{filtered.length} files</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input ref={inputRef} type="file" accept="image/*,video/*" multiple onChange={handleUpload} style={{ display: "none" }} />
            <button className="admin-btn admin-btn-secondary" onClick={() => inputRef.current?.click()} disabled={uploading}>
              {uploading ? "Uploading..." : "↑ Upload"}
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", opacity: 0.4, fontSize: 13 }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", opacity: 0.4, fontSize: 13 }}>No files yet.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, paddingTop: 12 }}>
            {filtered.map(asset => (
              <div key={asset.publicId} style={{ borderRadius: 6, overflow: "hidden", position: "relative", background: "var(--admin-input-bg)" }}>
                <div style={{ aspectRatio: "1" }}>
                  {asset.kind === "video" ? (
                    <video src={asset.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                  ) : (
                    <img src={asset.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
                <div style={{ padding: "6px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, opacity: 0.4 }}>{asset.kind === "video" ? "▶ video" : "image"} · {Math.round(asset.bytes / 1024)}kb</span>
                  <button
                    onClick={() => handleDelete(asset)}
                    disabled={deleting === asset.publicId}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#e53", opacity: 0.6, padding: 0 }}
                  >
                    {deleting === asset.publicId ? "..." : "×"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

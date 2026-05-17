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
  const [uploadError, setUploadError] = useState("");
  const [converting, setConverting] = useState(false);
  const [convertResult, setConvertResult] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function fetchAssets() {
    setLoading(true);
    const res = await fetch("/api/r2-media");
    const data = await res.json();
    setAssets(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { fetchAssets(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setUploadError("");

    for (const file of files) {
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
        const { uploadUrl } = await sigRes.json();
        const putRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!putRes.ok) throw new Error(`R2 upload failed (HTTP ${putRes.status})`);
      } catch (err) {
        setUploadError(`${file.name}: ${err instanceof Error ? err.message : "Upload failed"}`);
      }
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    fetchAssets();
  }

  async function handleDelete(asset: Asset) {
    if (!confirm("Delete this file?")) return;
    setDeleting(asset.publicId);
    try {
      const res = await fetch("/api/r2-media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: asset.publicId }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setAssets(prev => prev.filter(a => a.publicId !== asset.publicId));
    } catch {
      alert("Failed to delete file.");
    } finally {
      setDeleting(null);
    }
  }

  async function handleConvertGifs() {
    if (!confirm("This will convert all GIFs in storage to MP4 and update all database URLs. Continue?")) return;
    setConverting(true);
    setConvertResult("");
    try {
      const res = await fetch("/api/admin/convert-gifs", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Conversion failed");
      setConvertResult(`Done — converted ${data.converted} of ${data.total} GIF(s) to MP4.`);
      fetchAssets();
    } catch (err) {
      setConvertResult(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setConverting(false);
    }
  }

  const filtered = assets.filter(a => filter === "all" || a.kind === filter);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Media Library</h1>
          <p>All uploaded images and videos</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {convertResult && <span className="admin-save-msg" style={{ color: convertResult.startsWith("Error") ? "#e53" : undefined }}>{convertResult}</span>}
          <button
            className="admin-btn-secondary"
            onClick={handleConvertGifs}
            disabled={converting}
            title="Convert all GIFs in storage to MP4 and update database URLs"
          >
            {converting ? "Converting GIFs..." : "Convert GIFs → MP4"}
          </button>
        </div>
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
        {uploadError && (
          <div style={{ padding: "8px 12px", marginTop: 8, background: "rgba(229, 51, 51, 0.1)", color: "#e53", fontSize: 12, borderRadius: 4 }}>
            {uploadError}
          </div>
        )}

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

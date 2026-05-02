"use client";

import { useEffect, useRef, useState } from "react";

function FileUploadField({
  label, hint, type, current, onUploaded,
}: {
  label: string; hint: string; type: "logo" | "favicon";
  current: string; onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("type", type);
    try {
      const res = await fetch("/api/settings/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Upload failed"); }
      else { onUploaded(json.url); }
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="admin-form-group">
      <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        {current && (
          <img src={current} alt={label} style={{ height: 56, maxWidth: 160, objectFit: "contain", background: "#111", borderRadius: 6, padding: 6 }} />
        )}
        <div>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          <button type="button" className="admin-btn-add" onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? "Uploading..." : current ? "Replace" : "Upload"}
          </button>
          {error && <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{error}</p>}
        </div>
      </div>
      <p style={{ fontSize: 12, color: "#999", marginTop: 6 }}>{hint}</p>
    </div>
  );
}

export default function SettingsPage() {
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => { setLogoUrl(d.logoUrl || ""); setFaviconUrl(d.faviconUrl || ""); setLoading(false); });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logoUrl, faviconUrl }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>Site Settings</h1>
        <p>Upload logo and favicon — saved to server, URL stored in database</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {saved && <span className="admin-save-msg">Saved ✓</span>}
          <button className="admin-btn-primary" disabled={saving} onClick={handleSave}>
            <i className="fas fa-save"></i> {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {loading ? <p style={{ padding: 24 }}>Loading...</p> : (
        <div style={{ padding: 24, maxWidth: 560 }}>
          <FileUploadField
            label="Site Logo"
            hint="Shown in the portfolio sidebar. Transparent PNG recommended."
            type="logo"
            current={logoUrl}
            onUploaded={setLogoUrl}
          />
          <div style={{ marginBottom: 32 }} />
          <FileUploadField
            label="Favicon"
            hint="Shown in the browser tab. Square PNG, min 64×64px."
            type="favicon"
            current={faviconUrl}
            onUploaded={setFaviconUrl}
          />
        </div>
      )}
    </div>
  );
}

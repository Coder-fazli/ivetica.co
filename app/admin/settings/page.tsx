"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

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
        <p>Manage your site logo and favicon</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {saved && <span className="admin-save-msg">Saved ✓</span>}
          <button className="admin-btn-primary" disabled={saving} onClick={handleSave}>
            <i className="fas fa-save"></i> {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {loading ? <p style={{ padding: 24 }}>Loading...</p> : (
        <div style={{ padding: 24, maxWidth: 600 }}>
          <div className="admin-form-group" style={{ marginBottom: 32 }}>
            <ImageUpload label="Site Logo" value={logoUrl} onChange={setLogoUrl} />
            <p style={{ fontSize: 12, color: "#999", marginTop: 6 }}>
              Shown in the portfolio sidebar. Recommended: transparent PNG, white text.
            </p>
          </div>

          <div className="admin-form-group" style={{ marginBottom: 32 }}>
            <ImageUpload label="Favicon" value={faviconUrl} onChange={setFaviconUrl} />
            <p style={{ fontSize: 12, color: "#999", marginTop: 6 }}>
              Shown in browser tab. Recommended: square PNG, min 64×64px.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

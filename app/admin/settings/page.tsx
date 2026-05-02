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
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Site Settings</h1>
        <p>Manage your site logo and favicon</p>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="admin-form-card">
          <ImageUpload label="Site Logo" value={logoUrl} onChange={setLogoUrl} />
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: -12, marginBottom: 20 }}>
            Shown in the portfolio sidebar. Recommended: transparent PNG, white text.
          </p>

          <ImageUpload label="Favicon" value={faviconUrl} onChange={setFaviconUrl} />
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: -12, marginBottom: 20 }}>
            Shown in browser tab. Recommended: square PNG, min 64×64px.
          </p>

          <button className="admin-btn-save" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Settings"}
          </button>
        </div>
      )}
    </div>
  );
}

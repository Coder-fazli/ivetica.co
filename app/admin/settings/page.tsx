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

type FontSizes = {
  heroTagline: number;
  cardTitle: number;
  cardDesc: number;
  workTitle: number;
  workBody: number;
  contactLabel: number;
  contactLink: number;
};

const defaultFontSizes: FontSizes = {
  heroTagline: 15,
  cardTitle: 16,
  cardDesc: 14,
  workTitle: 30,
  workBody: 13,
  contactLabel: 11,
  contactLink: 14,
};

export default function SettingsPage() {
  const [logoUrl, setLogoUrl] = useState("");
  const [logoUrlLight, setLogoUrlLight] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [fontSizes, setFontSizes] = useState<FontSizes>(defaultFontSizes);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => {
        setLogoUrl(d.logoUrl || "");
        setLogoUrlLight(d.logoUrlLight || "");
        setFaviconUrl(d.faviconUrl || "");
        setFontSizes(d.fontSizes || defaultFontSizes);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logoUrl, logoUrlLight, faviconUrl, fontSizes }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function resetFontSizes() {
    setFontSizes(defaultFontSizes);
  }

  function updateFontSize(key: keyof FontSizes, value: number) {
    setFontSizes(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>Site Settings</h1>
        <p>Manage logo, favicon, and font sizes</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {saved && <span className="admin-save-msg">Saved ✓</span>}
          <button className="admin-btn-primary" disabled={saving} onClick={handleSave}>
            <i className="fas fa-save"></i> {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {loading ? <p style={{ padding: 24 }}>Loading...</p> : (
        <div style={{ padding: 24, maxWidth: 800 }}>
          {/* Logo & Favicon Section */}
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em", color: "#aaa" }}>
              Branding
            </h2>
            <FileUploadField
              label="Site Logo (Dark Mode)"
              hint="Shown in dark theme. Transparent PNG recommended."
              type="logo"
              current={logoUrl}
              onUploaded={setLogoUrl}
            />
            <div style={{ marginBottom: 24 }} />
            <FileUploadField
              label="Site Logo (Light Mode)"
              hint="Shown in light theme. Transparent PNG recommended."
              type="logo"
              current={logoUrlLight}
              onUploaded={setLogoUrlLight}
            />
            <div style={{ marginBottom: 24 }} />
            <FileUploadField
              label="Favicon"
              hint="Shown in the browser tab. Square PNG, min 64×64px."
              type="favicon"
              current={faviconUrl}
              onUploaded={setFaviconUrl}
            />
          </div>

          {/* Font Sizes Section */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#aaa" }}>
                Font Sizes
              </h2>
              <button
                type="button"
                onClick={resetFontSizes}
                style={{
                  fontSize: 11,
                  padding: "4px 12px",
                  borderRadius: 4,
                  border: "1px solid #333",
                  background: "transparent",
                  color: "#aaa",
                  cursor: "pointer",
                }}
              >
                Reset to Defaults
              </button>
            </div>

            {/* Sidebar Section */}
            <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #1e1e1e" }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, opacity: 0.6 }}>Sidebar</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <FontSizeInput
                  label="Hero Tagline"
                  hint="e.g. 'DOING WHAT MATTERS'"
                  value={fontSizes.heroTagline}
                  onChange={(v) => updateFontSize("heroTagline", v)}
                />
                <FontSizeInput
                  label="Card Title"
                  hint="Work name in sidebar"
                  value={fontSizes.cardTitle}
                  onChange={(v) => updateFontSize("cardTitle", v)}
                />
                <FontSizeInput
                  label="Card Description"
                  hint="Work description in sidebar"
                  value={fontSizes.cardDesc}
                  onChange={(v) => updateFontSize("cardDesc", v)}
                />
              </div>
            </div>

            {/* Work Page Section */}
            <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #1e1e1e" }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, opacity: 0.6 }}>Work Page</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <FontSizeInput
                  label="Page Title"
                  hint="Work detail page heading"
                  value={fontSizes.workTitle}
                  onChange={(v) => updateFontSize("workTitle", v)}
                />
                <FontSizeInput
                  label="Body Text"
                  hint="Description paragraphs"
                  value={fontSizes.workBody}
                  onChange={(v) => updateFontSize("workBody", v)}
                />
              </div>
            </div>

            {/* Contact Sidebar Section */}
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, opacity: 0.6 }}>Contact Info</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <FontSizeInput
                  label="Label Text"
                  hint="e.g. 'New Business', 'Inquiries'"
                  value={fontSizes.contactLabel}
                  onChange={(v) => updateFontSize("contactLabel", v)}
                />
                <FontSizeInput
                  label="Link Text"
                  hint="Email and phone"
                  value={fontSizes.contactLink}
                  onChange={(v) => updateFontSize("contactLink", v)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FontSizeInput({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="admin-form-group">
      <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="range"
          min="8"
          max="60"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: 13, fontWeight: 500, minWidth: 40, textAlign: "right" }}>
          {value}px
        </span>
      </div>
      <p style={{ fontSize: 12, color: "#999", marginTop: 6 }}>{hint}</p>
    </div>
  );
}

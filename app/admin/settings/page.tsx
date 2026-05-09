"use client";

import { useEffect, useState } from "react";
import ImageMediaPicker from "@/components/admin/ImageMediaPicker";

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
  const [homepageVideo, setHomepageVideo] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoUrlLight, setLogoUrlLight] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [tagline, setTagline] = useState("DOING WHAT MATTERS");
  const [fontSizes, setFontSizes] = useState<FontSizes>(defaultFontSizes);
  const [socialTiktok, setSocialTiktok] = useState("");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => {
        setHomepageVideo(d.homepageVideo || "");
        setLogoUrl(d.logoUrl || "");
        setLogoUrlLight(d.logoUrlLight || "");
        setFaviconUrl(d.faviconUrl || "");
        setTagline(d.tagline || "DOING WHAT MATTERS");
        setFontSizes(d.fontSizes || defaultFontSizes);
        setSocialTiktok(d.socialTiktok || "");
        setSocialFacebook(d.socialFacebook || "");
        setSocialInstagram(d.socialInstagram || "");
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const payload = { homepageVideo, logoUrl, logoUrlLight, faviconUrl, tagline, fontSizes, socialTiktok, socialFacebook, socialInstagram };
      console.log("[Settings Save] Sending:", payload);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const resData = await res.json();
      console.log("[Settings Save] Response:", res.status, resData);
      if (!res.ok) {
        alert(`Save failed: ${resData.error || "Unknown error"}`);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("[Settings Save] Network error:", err);
      alert("Save failed: Network error");
    } finally {
      setSaving(false);
    }
  }

  function resetFontSizes() {
    setFontSizes(defaultFontSizes);
  }

  function updateFontSize(key: keyof FontSizes, value: number) {
    setFontSizes(prev => ({ ...prev, [key]: value }));
  }

  return (
    <>
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
          {/* Homepage Section */}
          <div style={{ marginBottom: 48, paddingBottom: 48, borderBottom: "1px solid #1e1e1e" }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em", color: "#aaa" }}>
              Homepage
            </h2>
            <div className="admin-field-group" style={{ marginBottom: 8 }}>
              <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>Main Video / GIF</label>
              <p style={{ fontSize: 11, opacity: 0.4, marginBottom: 12 }}>Displayed on the homepage when no work is selected. Supports .mp4, .webm, .gif</p>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
                {homepageVideo && (
                  <div style={{ width: 140, height: 140, borderRadius: 8, overflow: "hidden", border: "1px solid #333", flexShrink: 0 }}>
                    {homepageVideo.match(/\.(gif)$/i)
                      ? <img src={homepageVideo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <video src={homepageVideo} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    }
                  </div>
                )}
                <div>
                  <input
                    value={homepageVideo}
                    onChange={(e) => setHomepageVideo(e.target.value)}
                    className="admin-input"
                    placeholder="Paste URL or browse media"
                    style={{ marginBottom: 8, minWidth: 280 }}
                  />
                  <div>
                    <ImageMediaPicker
                      label=""
                      value={homepageVideo}
                      onChange={setHomepageVideo}
                      accept="all"
                    />
                  </div>
                  {homepageVideo && (
                    <button type="button" onClick={() => setHomepageVideo("")} style={{ marginTop: 6, fontSize: 11, color: "#e53", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Logo & Favicon Section */}
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em", color: "#aaa" }}>
              Branding
            </h2>
            <div className="admin-form-group" style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value.toUpperCase())}
                className="admin-input"
                placeholder="DOING WHAT MATTERS"
                style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
              />
              <p style={{ fontSize: 11, opacity: 0.4, marginTop: 4 }}>Displayed below the logo. First word is white, rest turns yellow.</p>
            </div>
            <ImageMediaPicker label="Site Logo (Dark Mode)" value={logoUrl} onChange={setLogoUrl} />
            <div style={{ marginBottom: 24 }} />
            <ImageMediaPicker label="Site Logo (Light Mode)" value={logoUrlLight} onChange={setLogoUrlLight} />
            <div style={{ marginBottom: 24 }} />
            <ImageMediaPicker label="Favicon" value={faviconUrl} onChange={setFaviconUrl} />
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
            <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #1e1e1e" }}>
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

            {/* Social Media Section */}
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, opacity: 0.6 }}>Social Media</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                <div className="admin-form-group">
                  <label>TikTok URL</label>
                  <input
                    type="text"
                    value={socialTiktok}
                    onChange={(e) => setSocialTiktok(e.target.value)}
                    className="admin-input"
                    placeholder="https://tiktok.com/@..."
                  />
                </div>
                <div className="admin-form-group">
                  <label>Facebook URL</label>
                  <input
                    type="text"
                    value={socialFacebook}
                    onChange={(e) => setSocialFacebook(e.target.value)}
                    className="admin-input"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="admin-form-group">
                  <label>Instagram URL</label>
                  <input
                    type="text"
                    value={socialInstagram}
                    onChange={(e) => setSocialInstagram(e.target.value)}
                    className="admin-input"
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
    </>
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

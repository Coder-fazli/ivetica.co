"use client";

import { useEffect, useState } from "react";
import ImageMediaPicker from "@/components/admin/ImageMediaPicker";

type SocialLink = { name: string; url: string; iconSvg: string };

const DEFAULT_TIKTOK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4v-7a6.04 6.04 0 0 0 3.27-.93"/></svg>`;
const DEFAULT_FACEBOOK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a6 6 0 0 0-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 0 1 1-1h3z"/></svg>`;
const DEFAULT_INSTAGRAM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>`;

type FontSizes = {
  heroTagline: number;
  cardTitle: number;
  cardDesc: number;
  workTitle: number;
  workBody: number;
  contactLabel: number;
  contactLink: number;
  aboutSectionLabel: number;
  sidebarAboutLabel: number;
};

const defaultFontSizes: FontSizes = {
  heroTagline: 15,
  cardTitle: 16,
  cardDesc: 14,
  workTitle: 30,
  workBody: 13,
  contactLabel: 11,
  contactLink: 14,
  aboutSectionLabel: 10,
  sidebarAboutLabel: 11,
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
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
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
        setFontSizes({ ...defaultFontSizes, ...(d.fontSizes || {}) });
        setSocialTiktok(d.socialTiktok || "");
        setSocialFacebook(d.socialFacebook || "");
        setSocialInstagram(d.socialInstagram || "");
        const links: SocialLink[] = d.socialLinks && d.socialLinks.length > 0
          ? d.socialLinks
          : [
              ...(d.socialTiktok ? [{ name: "TikTok", url: d.socialTiktok, iconSvg: DEFAULT_TIKTOK_SVG }] : []),
              ...(d.socialFacebook ? [{ name: "Facebook", url: d.socialFacebook, iconSvg: DEFAULT_FACEBOOK_SVG }] : []),
              ...(d.socialInstagram ? [{ name: "Instagram", url: d.socialInstagram, iconSvg: DEFAULT_INSTAGRAM_SVG }] : []),
            ];
        setSocialLinks(links);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homepageVideo, logoUrl, logoUrlLight, faviconUrl, tagline, fontSizes, socialTiktok, socialFacebook, socialInstagram, socialLinks }),
      });
      if (!res.ok) {
        const err = await res.json();
        console.error("[Settings Save] Error:", err);
        alert(`Save failed: ${err.error || "Unknown error"}`);
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

            {/* About Page Section */}
            <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #1e1e1e" }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, opacity: 0.6 }}>About Page</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <FontSizeInput
                  label="Section Labels"
                  hint="Clients, Contact, Join Our Team..."
                  value={fontSizes.aboutSectionLabel}
                  onChange={(v) => updateFontSize("aboutSectionLabel", v)}
                />
                <FontSizeInput
                  label="Sidebar About Label"
                  hint="Label above sidebar description"
                  value={fontSizes.sidebarAboutLabel}
                  onChange={(v) => updateFontSize("sidebarAboutLabel", v)}
                />
              </div>
            </div>

            {/* Social Media Section */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, opacity: 0.6, margin: 0 }}>Social Media</h3>
                <button
                  type="button"
                  onClick={() => setSocialLinks(prev => [...prev, { name: "", url: "", iconSvg: "" }])}
                  style={{ fontSize: 11, padding: "4px 12px", borderRadius: 4, border: "1px solid #333", background: "transparent", color: "#aaa", cursor: "pointer" }}
                >
                  + Add Link
                </button>
              </div>
              <p style={{ fontSize: 11, opacity: 0.4, marginBottom: 16 }}>
                Paste any SVG icon code in the Icon field. Icons are rendered as-is at 20×20px.
              </p>
              {socialLinks.length === 0 && (
                <p style={{ fontSize: 12, opacity: 0.3, fontStyle: "italic" }}>No social links yet. Click "Add Link" to add one.</p>
              )}
              {socialLinks.map((link, i) => (
                <div key={i} style={{ border: "1px solid #1e1e1e", borderRadius: 8, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 11, opacity: 0.4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Link {i + 1}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {link.iconSvg && (
                        <span
                          dangerouslySetInnerHTML={{ __html: link.iconSvg }}
                          style={{ display: "flex", alignItems: "center", color: "#aaa", width: 20, height: 20 }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => setSocialLinks(prev => prev.filter((_, idx) => idx !== i))}
                        style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, border: "1px solid #444", background: "transparent", color: "#e53", cursor: "pointer" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10, marginBottom: 10 }}>
                    <div className="admin-form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: 10, opacity: 0.5, display: "block", marginBottom: 4 }}>Name</label>
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => setSocialLinks(prev => prev.map((l, idx) => idx === i ? { ...l, name: e.target.value } : l))}
                        className="admin-input"
                        placeholder="Instagram"
                      />
                    </div>
                    <div className="admin-form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: 10, opacity: 0.5, display: "block", marginBottom: 4 }}>URL</label>
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => setSocialLinks(prev => prev.map((l, idx) => idx === i ? { ...l, url: e.target.value } : l))}
                        className="admin-input"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                  </div>
                  <div className="admin-form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: 10, opacity: 0.5, display: "block", marginBottom: 4 }}>SVG Icon Code</label>
                    <textarea
                      value={link.iconSvg}
                      onChange={(e) => setSocialLinks(prev => prev.map((l, idx) => idx === i ? { ...l, iconSvg: e.target.value } : l))}
                      className="admin-input"
                      placeholder={`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" ...>...</svg>`}
                      rows={3}
                      style={{ resize: "vertical", fontFamily: "monospace", fontSize: 11 }}
                    />
                  </div>
                </div>
              ))}
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

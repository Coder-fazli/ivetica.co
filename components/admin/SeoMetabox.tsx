"use client";

import { useState, useEffect } from "react";
import { getPageSeo, updatePageSeo } from "@/actions/pageSeo";

type Props = { page: string };

export default function SeoMetabox({ page }: Props) {
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getPageSeo(page).then((d) => {
      setMetaTitle(d.metaTitle);
      setMetaDescription(d.metaDescription);
    });
  }, [page]);

  async function save() {
    setSaving(true);
    await updatePageSeo(page, { metaTitle, metaDescription });
    setSaving(false);
    setMsg("SEO saved");
    setTimeout(() => setMsg(""), 2500);
  }

  const titleLen = metaTitle.length;
  const descLen = metaDescription.length;

  return (
    <div className="admin-accordion-item" style={{ marginTop: 12 }}>
      <div className="admin-accordion-header" style={{ cursor: "default" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <i className="fas fa-search" style={{ fontSize: 12, color: "#aaa" }}></i>
          SEO — Meta Title &amp; Description
        </span>
        {msg && <span style={{ fontSize: 11, color: "#27ae60", fontWeight: 400 }}>{msg}</span>}
      </div>
      <div className="admin-accordion-body">
        <div className="admin-row">
          <div className="admin-col">
            <div className="admin-form-group">
              <label>
                Meta Title
                <span style={{ marginLeft: 6, color: titleLen > 60 ? "#e74c3c" : "#aaa", fontWeight: 400 }}>
                  {titleLen}/60
                </span>
              </label>
              <input
                className="admin-input"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Page title for search engines"
                maxLength={80}
              />
            </div>
          </div>
          <div className="admin-col">
            <div className="admin-form-group">
              <label>
                Meta Description
                <span style={{ marginLeft: 6, color: descLen > 160 ? "#e74c3c" : "#aaa", fontWeight: 400 }}>
                  {descLen}/160
                </span>
              </label>
              <input
                className="admin-input"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Brief description shown in search results"
                maxLength={200}
              />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="admin-btn-add" onClick={save} disabled={saving}>
            <i className="fas fa-save"></i> {saving ? "Saving..." : "Save SEO"}
          </button>
        </div>

        {/* live preview */}
        {(metaTitle || metaDescription) && (
          <div style={{ marginTop: 14, padding: "12px 14px", background: "#f9f9f9", border: "1px solid #e8e8e8", borderRadius: 6 }}>
            <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.4px" }}>Search Preview</div>
            <div style={{ fontSize: 18, color: "#1a0dab", fontWeight: 400, marginBottom: 2, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
              {metaTitle || "Page Title"}
            </div>
            <div style={{ fontSize: 12, color: "#006621", marginBottom: 4 }}>lvetica.co</div>
            <div style={{ fontSize: 13, color: "#545454", lineHeight: 1.5 }}>
              {metaDescription || "No description set."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

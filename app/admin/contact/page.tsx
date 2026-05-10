"use client";

import { useState, useEffect } from "react";
import { getContact, updateContact, ContactData } from "@/actions/contact";
import ImageMediaPicker from "@/components/admin/ImageMediaPicker";

const empty: ContactData = {
  emailBusiness: "",
  emailInfluencer: "",
  phone: "",
  location: "",
  mapEmbed: "",
  mapCoverImage: "",
};

export default function AdminContact() {
  const [data, setData] = useState<ContactData>(empty);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    getContact().then(setData);
  }, []);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function update(field: keyof ContactData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    setMessage("");
    await updateContact(data);
    setSaving(false);
    setDirty(false);
    setMessage("Saved!");
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Contact</h1>
          <p>Edit contact info shown on the About page.</p>
        </div>
        {message && (
          <div style={{ padding: "8px 12px", background: "rgba(76,175,80,0.1)", color: "#4caf50", borderRadius: 4, fontSize: 12 }}>
            {message}
          </div>
        )}
      </div>

      <div className="admin-card">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="admin-field-group" style={{ marginBottom: 0 }}>
              <label>New Business Email</label>
              <input
                value={data.emailBusiness}
                onChange={(e) => update("emailBusiness", e.target.value)}
                className="admin-input"
                placeholder="salam@lvetica.co"
                type="email"
              />
            </div>
            <div className="admin-field-group" style={{ marginBottom: 0 }}>
              <label>Influencer Inquiries Email</label>
              <input
                value={data.emailInfluencer}
                onChange={(e) => update("emailInfluencer", e.target.value)}
                className="admin-input"
                placeholder="influencer@lvetica.co"
                type="email"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="admin-field-group" style={{ marginBottom: 0 }}>
              <label>Phone</label>
              <input
                value={data.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="admin-input"
                placeholder="+994 10 505 06 66"
              />
            </div>
            <div className="admin-field-group" style={{ marginBottom: 0 }}>
              <label>Location</label>
              <input
                value={data.location}
                onChange={(e) => update("location", e.target.value)}
                className="admin-input"
                placeholder="pr 3141 Matbuat Avenue, Baku 1000"
              />
            </div>
          </div>

          <div className="admin-field-group" style={{ marginBottom: 0 }}>
            <label>Google Maps Embed URL</label>
            <input
              value={data.mapEmbed}
              onChange={(e) => update("mapEmbed", e.target.value)}
              className="admin-input"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p style={{ fontSize: 11, opacity: 0.4, marginTop: 4 }}>
              Go to Google Maps → Share → Embed a map → copy the src URL from the iframe code
            </p>
          </div>

          <div className="admin-field-group" style={{ marginBottom: 0 }}>
            <label>Map Cover Image</label>
            <p style={{ fontSize: 11, opacity: 0.4, marginBottom: 8 }}>Displayed above the map in the About sidebar</p>
            <ImageMediaPicker
              label=""
              value={data.mapCoverImage}
              onChange={(url) => update("mapCoverImage", url)}
            />
          </div>

          <div className="admin-actions">
            <button onClick={save} disabled={saving || !dirty} className="admin-btn-primary">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { getContact, updateContact, ContactData } from "@/actions/contact";
import SeoMetabox from "@/components/admin/SeoMetabox";

const empty: ContactData = {
  email: "",
  phone: "",
  location: "",
  mapEmbed: "",
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
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
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
    setMessage("Saved successfully.");
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <>
      <div className="admin-page-header">
        <h1>Contact Page</h1>
        <p>Edit the contact info shown on the contact page.</p>
      </div>

      <div className="admin-accordion-item" style={{ marginBottom: 24 }}>
        <div className="admin-accordion-body" style={{ display: "block" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div className="admin-field-group" style={{ marginBottom: 0 }}>
              <label>Email</label>
              <input value={data.email} onChange={(e) => update("email", e.target.value)} className="admin-input" />
            </div>
            <div className="admin-field-group" style={{ marginBottom: 0 }}>
              <label>Phone</label>
              <input value={data.phone} onChange={(e) => update("phone", e.target.value)} className="admin-input" />
            </div>
            <div className="admin-field-group" style={{ marginBottom: 0 }}>
              <label>Location</label>
              <input value={data.location} onChange={(e) => update("location", e.target.value)} className="admin-input" />
            </div>
            <div className="admin-field-group" style={{ marginBottom: 0 }}>
              <label>Google Maps Embed URL</label>
              <input value={data.mapEmbed} onChange={(e) => update("mapEmbed", e.target.value)} className="admin-input" placeholder="https://www.google.com/maps/embed?..." />
            </div>
          </div>

          <div className="admin-actions">
            <button onClick={save} disabled={saving} className="admin-btn-primary">
              {saving ? "Saving..." : "Save"}
            </button>
            {message && <span className="admin-save-msg">{message}</span>}
          </div>
        </div>
      </div>
      <SeoMetabox page="contact" />
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { getAbout, updateAbout, AboutData, ValueItem, TeamMember, Offering } from "@/actions/about";
import ImageUpload from "@/components/admin/ImageUpload";
import SeoMetabox from "@/components/admin/SeoMetabox";

const emptyValue: ValueItem = { number: "", title: "", text: "" };
const emptyMember: TeamMember = { name: "", role: "", photo: "", bio: "" };
const emptyOffering: Offering = { name: "", desc: "", services: "" };

const emptyData: AboutData = {
  story: { title: "", description1: "", description2: "", image: "", founderQuote: "", founderAvatar: "" },
  values: [],
  team: [],
  offerings: [],
  sidebarLabel: "",
  sidebarDesc: "",
  studioTitle: "",
  studioText1: "",
  studioText2: "",
  studioText3: "",
};

export default function AdminAbout() {
  const [data, setData] = useState<AboutData>(emptyData);
  const [openSection, setOpenSection] = useState<string | null>("story");
  const [openMember, setOpenMember] = useState<number | null>(null);
  const [openOffering, setOpenOffering] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    getAbout().then(setData);
  }, []);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function updateStory(field: keyof AboutData["story"], value: string) {
    setData((prev) => ({ ...prev, story: { ...prev.story, [field]: value } }));
    setDirty(true);
  }

  function updateValue(i: number, field: keyof ValueItem, value: string) {
    setData((prev) => {
      const values = [...prev.values];
      values[i] = { ...values[i], [field]: value };
      return { ...prev, values };
    });
    setDirty(true);
  }

  function addValue() {
    setData((prev) => ({ ...prev, values: [...prev.values, { ...emptyValue }] }));
    setDirty(true);
  }

  function removeValue(i: number) {
    setData((prev) => ({ ...prev, values: prev.values.filter((_, idx) => idx !== i) }));
    setDirty(true);
  }

  function updateMember(i: number, field: keyof TeamMember, value: string) {
    setData((prev) => {
      const team = [...prev.team];
      team[i] = { ...team[i], [field]: value };
      return { ...prev, team };
    });
    setDirty(true);
  }

  function addMember() {
    setData((prev) => ({ ...prev, team: [...prev.team, { ...emptyMember }] }));
    setDirty(true);
  }

  function removeMember(i: number) {
    setData((prev) => ({ ...prev, team: prev.team.filter((_, idx) => idx !== i) }));
    setDirty(true);
  }

  function updateOffering(i: number, field: keyof Offering, value: string) {
    setData((prev) => {
      const offerings = [...(prev.offerings || [])];
      offerings[i] = { ...offerings[i], [field]: value };
      return { ...prev, offerings };
    });
    setDirty(true);
  }

  function addOffering() {
    setData((prev) => ({ ...prev, offerings: [...(prev.offerings || []), { ...emptyOffering }] }));
    setDirty(true);
  }

  function removeOffering(i: number) {
    setData((prev) => ({ ...prev, offerings: (prev.offerings || []).filter((_, idx) => idx !== i) }));
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    setMessage("");
    await updateAbout(data);
    setSaving(false);
    setDirty(false);
    setMessage("Saved successfully.");
    setTimeout(() => setMessage(""), 3000);
  }

  function toggle(section: string) {
    setOpenSection((prev) => (prev === section ? null : section));
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>About Page</h1>
          <p>Edit the about page content.</p>
        </div>
        <div className="admin-header-actions">
          <button onClick={save} disabled={saving} className="admin-btn-primary">
            {saving ? "Saving..." : "Save all"}
          </button>
          {message && <span className="admin-save-msg">{message}</span>}
        </div>
      </div>

      {/* Sidebar & Studio Text */}
      <div className="admin-accordion-item">
        <div className="admin-accordion-header" onClick={() => toggle("sidebar")}>
          <span>Sidebar &amp; Studio Text</span>
          <i className={`fas fa-chevron-${openSection === "sidebar" ? "up" : "down"}`}></i>
        </div>
        {openSection === "sidebar" && (
          <div className="admin-accordion-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div className="admin-field-group" style={{ marginBottom: 0 }}>
                <label>Sidebar Label</label>
                <input
                  value={data.sidebarLabel || ""}
                  onChange={(e) => { setData(p => ({ ...p, sidebarLabel: e.target.value })); setDirty(true); }}
                  className="admin-input"
                  placeholder="About us"
                />
              </div>
              <div className="admin-field-group" style={{ marginBottom: 0 }}>
                <label>Studio Section Title</label>
                <input
                  value={data.studioTitle || ""}
                  onChange={(e) => { setData(p => ({ ...p, studioTitle: e.target.value })); setDirty(true); }}
                  className="admin-input"
                  placeholder="Our Studio"
                />
              </div>
            </div>
            <div className="admin-field-group">
              <label>Sidebar Description</label>
              <textarea
                value={data.sidebarDesc || ""}
                onChange={(e) => { setData(p => ({ ...p, sidebarDesc: e.target.value })); setDirty(true); }}
                className="admin-input"
                style={{ minHeight: "unset", height: 60, resize: "vertical" }}
                placeholder="Short text shown in the sidebar below the label"
              />
            </div>
            <div className="admin-field-group">
              <label>Studio Paragraph 1</label>
              <textarea
                value={data.studioText1 || ""}
                onChange={(e) => { setData(p => ({ ...p, studioText1: e.target.value })); setDirty(true); }}
                className="admin-input"
                style={{ minHeight: "unset", height: 72, resize: "vertical" }}
              />
            </div>
            <div className="admin-field-group">
              <label>Studio Paragraph 2</label>
              <textarea
                value={data.studioText2 || ""}
                onChange={(e) => { setData(p => ({ ...p, studioText2: e.target.value })); setDirty(true); }}
                className="admin-input"
                style={{ minHeight: "unset", height: 72, resize: "vertical" }}
              />
            </div>
            <div className="admin-field-group" style={{ marginBottom: 0 }}>
              <label>Studio Paragraph 3</label>
              <textarea
                value={data.studioText3 || ""}
                onChange={(e) => { setData(p => ({ ...p, studioText3: e.target.value })); setDirty(true); }}
                className="admin-input"
                style={{ minHeight: "unset", height: 72, resize: "vertical" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Our Story */}
      <div className="admin-accordion-item">
        <div className="admin-accordion-header" onClick={() => toggle("story")}>
          <span>Our Story</span>
          <i className={`fas fa-chevron-${openSection === "story" ? "up" : "down"}`}></i>
        </div>
        {openSection === "story" && (
          <div className="admin-accordion-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="admin-field-group" style={{ marginBottom: 0 }}>
                <label>Section Title</label>
                <input value={data.story.title} onChange={(e) => updateStory("title", e.target.value)} className="admin-input" />
              </div>
              <div className="admin-field-group" style={{ marginBottom: 0 }}>
                <label>Founder Quote</label>
                <input value={data.story.founderQuote} onChange={(e) => updateStory("founderQuote", e.target.value)} className="admin-input" />
              </div>
              <div className="admin-field-group" style={{ marginBottom: 0 }}>
                <label>Paragraph 1</label>
                <textarea value={data.story.description1} onChange={(e) => updateStory("description1", e.target.value)} className="admin-input" style={{ minHeight: "unset", height: 72, resize: "vertical" }} />
              </div>
              <div className="admin-field-group" style={{ marginBottom: 0 }}>
                <label>Paragraph 2</label>
                <textarea value={data.story.description2} onChange={(e) => updateStory("description2", e.target.value)} className="admin-input" style={{ minHeight: "unset", height: 72, resize: "vertical" }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
              <ImageUpload label="Section Image" value={data.story.image} onChange={(url) => { updateStory("image", url); setDirty(true); }} />
              <ImageUpload label="Founder Avatar" value={data.story.founderAvatar} onChange={(url) => { updateStory("founderAvatar", url); setDirty(true); }} />
            </div>
          </div>
        )}
      </div>

      {/* Mission & Values */}
      <div className="admin-accordion-item">
        <div className="admin-accordion-header" onClick={() => toggle("values")}>
          <span>Mission &amp; Values</span>
          <i className={`fas fa-chevron-${openSection === "values" ? "up" : "down"}`}></i>
        </div>
        {openSection === "values" && (
          <div className="admin-accordion-body">
            {data.values.map((v, i) => (
              <div key={i} className="admin-list-item">
                <div className="admin-list-item-header">
                  <strong>{v.title || `Value ${i + 1}`}</strong>
                  <button onClick={() => removeValue(i)} className="admin-btn-remove">Remove</button>
                </div>
                <div className="admin-field-group">
                  <label>Number (e.g. 01)</label>
                  <input value={v.number} onChange={(e) => updateValue(i, "number", e.target.value)} className="admin-input" />
                </div>
                <div className="admin-field-group">
                  <label>Title</label>
                  <input value={v.title} onChange={(e) => updateValue(i, "title", e.target.value)} className="admin-input" />
                </div>
                <div className="admin-field-group">
                  <label>Description</label>
                  <textarea value={v.text} onChange={(e) => updateValue(i, "text", e.target.value)} className="admin-input" rows={3} />
                </div>
              </div>
            ))}
            <button onClick={addValue} className="admin-btn-add">+ Add Value</button>
          </div>
        )}
      </div>

      {/* Team */}
      <div className="admin-accordion-item">
        <div className="admin-accordion-header" onClick={() => toggle("team")}>
          <span>Team Members</span>
          <i className={`fas fa-chevron-${openSection === "team" ? "up" : "down"}`}></i>
        </div>
        {openSection === "team" && (
          <div className="admin-accordion-body">
            {data.team.map((m, i) => {
              const isOpen = openMember === i;
              return (
                <div key={i} style={{ border: "1px solid var(--admin-input-border)", borderRadius: 6, marginBottom: 8, overflow: "hidden" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", cursor: "pointer", background: isOpen ? "rgba(255,255,255,0.03)" : "transparent" }}
                    onClick={() => setOpenMember(isOpen ? null : i)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {m.photo && <img src={m.photo} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", opacity: 0.85 }} />}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name || `Member ${i + 1}`}</div>
                        {m.role && <div style={{ fontSize: 11, opacity: 0.45, marginTop: 1 }}>{m.role}</div>}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeMember(i); }}
                        className="admin-btn-remove"
                        style={{ fontSize: 11, padding: "2px 8px" }}
                      >
                        Remove
                      </button>
                      <i className={`fas fa-chevron-${isOpen ? "up" : "down"}`} style={{ fontSize: 11, opacity: 0.4 }}></i>
                    </div>
                  </div>
                  {isOpen && (
                    <div style={{ padding: "14px 14px 16px", borderTop: "1px solid var(--admin-input-border)" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                        <div className="admin-field-group" style={{ marginBottom: 0 }}>
                          <label>Name</label>
                          <input value={m.name} onChange={(e) => updateMember(i, "name", e.target.value)} className="admin-input" />
                        </div>
                        <div className="admin-field-group" style={{ marginBottom: 0 }}>
                          <label>Role</label>
                          <input value={m.role} onChange={(e) => updateMember(i, "role", e.target.value)} className="admin-input" />
                        </div>
                      </div>
                      <div className="admin-field-group">
                        <label>Bio</label>
                        <textarea value={m.bio || ""} onChange={(e) => updateMember(i, "bio", e.target.value)} className="admin-input" rows={3} />
                      </div>
                      <ImageUpload label="Photo" value={m.photo} onChange={(url) => { updateMember(i, "photo", url); setDirty(true); }} />
                    </div>
                  )}
                </div>
              );
            })}
            <button onClick={() => { addMember(); setOpenMember(data.team.length); }} className="admin-btn-add">+ Add Member</button>
          </div>
        )}
      </div>

      {/* Offerings */}
      <div className="admin-accordion-item">
        <div className="admin-accordion-header" onClick={() => toggle("offerings")}>
          <span>Offerings</span>
          <i className={`fas fa-chevron-${openSection === "offerings" ? "up" : "down"}`}></i>
        </div>
        {openSection === "offerings" && (
          <div className="admin-accordion-body">
            {(data.offerings || []).map((o, i) => {
              const isOpen = openOffering === i;
              return (
                <div key={i} style={{ border: "1px solid var(--admin-input-border)", borderRadius: 6, marginBottom: 8, overflow: "hidden" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", cursor: "pointer", background: isOpen ? "rgba(255,255,255,0.03)" : "transparent" }}
                    onClick={() => setOpenOffering(isOpen ? null : i)}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{o.name || `Offering ${i + 1}`}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeOffering(i); }}
                        className="admin-btn-remove"
                        style={{ fontSize: 11, padding: "2px 8px" }}
                      >
                        Remove
                      </button>
                      <i className={`fas fa-chevron-${isOpen ? "up" : "down"}`} style={{ fontSize: 11, opacity: 0.4 }}></i>
                    </div>
                  </div>
                  {isOpen && (
                    <div style={{ padding: "14px 14px 16px", borderTop: "1px solid var(--admin-input-border)" }}>
                      <div className="admin-field-group">
                        <label>Name</label>
                        <input value={o.name} onChange={(e) => updateOffering(i, "name", e.target.value)} className="admin-input" placeholder="e.g. Strategy" />
                      </div>
                      <div className="admin-field-group">
                        <label>Description</label>
                        <textarea value={o.desc} onChange={(e) => updateOffering(i, "desc", e.target.value)} className="admin-input" rows={3} />
                      </div>
                      <div className="admin-field-group" style={{ marginBottom: 0 }}>
                        <label>Services (comma-separated)</label>
                        <textarea value={o.services} onChange={(e) => updateOffering(i, "services", e.target.value)} className="admin-input" rows={2} placeholder="Brand Strategy, Market Positioning, ..." />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <button onClick={() => { addOffering(); setOpenOffering((data.offerings || []).length); }} className="admin-btn-add">+ Add Offering</button>
          </div>
        )}
      </div>
      <SeoMetabox page="about" />
    </>
  );
}

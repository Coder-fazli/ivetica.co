"use client";

import { useState, useEffect } from "react";
import { getWorks, updateWork, createWork, deleteWork } from "@/actions/works";
import { WorkType } from "@/types";
import ImageUpload from "@/components/admin/ImageUpload";
import SeoMetabox from "@/components/admin/SeoMetabox";

const TAGS = ["Influencer", "UGC", "Production", "Social Media"];

const empty: WorkType = {
  title: "",
  slug: "",
  client: "",
  tags: [],
  thumbnail: "",
  challenge: "",
  approach: "",
  results: "",
  gallery: [],
  metrics: [],
};

export default function AdminWorks() {
  const [works, setWorks] = useState<WorkType[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const [saving, setSaving] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [dirtyIndexes, setDirtyIndexes] = useState<Set<number>>(new Set());

  useEffect(() => {
    getWorks().then((data) => setWorks(data as WorkType[]));
  }, []);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyIndexes.size > 0) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirtyIndexes]);

  function markDirty(i: number) {
    setDirtyIndexes((prev) => new Set(prev).add(i));
  }
  function markClean(i: number) {
    setDirtyIndexes((prev) => { const n = new Set(prev); n.delete(i); return n; });
  }

  function update(index: number, field: keyof WorkType, value: unknown) {
    const updated = [...works];
    updated[index] = { ...updated[index], [field]: value };
    setWorks(updated);
    markDirty(index);
  }

  function toggleTag(index: number, tag: string) {
    const current = works[index].tags || [];
    const next = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    update(index, "tags", next);
  }

  function addMetric(index: number) {
    const metrics = [...(works[index].metrics || []), { label: "", value: "" }];
    update(index, "metrics", metrics);
  }

  function updateMetric(wi: number, mi: number, field: "label" | "value", val: string) {
    const metrics = [...(works[wi].metrics || [])];
    metrics[mi] = { ...metrics[mi], [field]: val };
    update(wi, "metrics", metrics);
  }

  function removeMetric(wi: number, mi: number) {
    const metrics = (works[wi].metrics || []).filter((_, i) => i !== mi);
    update(wi, "metrics", metrics);
  }

  function addGalleryItem(index: number) {
    const gallery = [...(works[index].gallery || []), ""];
    update(index, "gallery", gallery);
  }

  function updateGallery(wi: number, gi: number, val: string) {
    const gallery = [...(works[wi].gallery || [])];
    gallery[gi] = val;
    update(wi, "gallery", gallery);
  }

  function removeGallery(wi: number, gi: number) {
    const gallery = (works[wi].gallery || []).filter((_, i) => i !== gi);
    update(wi, "gallery", gallery);
  }

  async function handleSave(index: number) {
    setSaving(index);
    setMessage("");
    try {
      const w = works[index];
      if (w.slug) {
        await updateWork(w.slug, w);
      } else {
        await createWork(w);
      }
      markClean(index);
      setMessage("Saved!");
    } catch {
      setMessage("Failed to save.");
    }
    setSaving(null);
  }

  async function handleDelete(index: number) {
    const w = works[index];
    if (!w.slug) {
      setWorks(works.filter((_, i) => i !== index));
      markClean(index);
      return;
    }
    await deleteWork(w.slug);
    setWorks(works.filter((_, i) => i !== index));
    markClean(index);
    if (open === index) setOpen(null);
  }

  function addWork() {
    setWorks([...works, { ...empty }]);
    setOpen(works.length);
  }

  return (
    <>
      <div className="admin-page-header">
        <h1>Works</h1>
        <p>Manage your portfolio projects</p>
      </div>

      {message && <div className="admin-alert admin-alert-success">{message}</div>}

      {dirtyIndexes.size > 0 && (
        <div className="admin-alert admin-alert-error" style={{ marginBottom: "16px" }}>
          <i className="fas fa-exclamation-triangle" style={{ marginRight: "8px" }}></i>
          You have unsaved changes in {dirtyIndexes.size} project{dirtyIndexes.size > 1 ? "s" : ""}.
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>All Works ({works.length})</h3>
          <button className="admin-btn admin-btn-secondary" onClick={addWork}>
            <i className="fas fa-plus"></i> Add Work
          </button>
        </div>

        {works.map((work, i) => (
          <div key={i} style={{ borderBottom: "1px solid var(--admin-input-border)" }}>

            {/* toggler header */}
            <div
              onClick={() => setOpen(open === i ? null : i)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", cursor: "pointer" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 500, fontSize: "14px" }}>
                {work.title || "New Work"}
                {dirtyIndexes.has(i) && (
                  <span style={{ fontSize: "10px", color: "var(--admin-accent)", background: "rgba(255,152,0,0.1)", padding: "2px 7px", borderRadius: "4px" }}>
                    unsaved
                  </span>
                )}
              </span>
              <i className={`fas fa-chevron-${open === i ? "up" : "down"}`} style={{ color: "var(--admin-muted)", fontSize: "12px" }}></i>
            </div>

            {/* expanded fields */}
            {open === i && (
              <div style={{ paddingBottom: "20px" }}>

                {/* title + slug */}
                <div className="admin-row">
                  <div className="admin-col">
                    <div className="admin-form-group">
                      <label className="admin-label">Title</label>
                      <input className="admin-input" style={{ padding: "6px 10px" }} value={work.title} onChange={(e) => update(i, "title", e.target.value)} />
                    </div>
                  </div>
                  <div className="admin-col">
                    <div className="admin-form-group">
                      <label className="admin-label">Slug (URL)</label>
                      <input className="admin-input" style={{ padding: "6px 10px" }} value={work.slug} onChange={(e) => update(i, "slug", e.target.value)} placeholder="e.g. brand-campaign-2024" />
                    </div>
                  </div>
                </div>

                {/* client + thumbnail */}
                <div className="admin-row">
                  <div className="admin-col">
                    <div className="admin-form-group">
                      <label className="admin-label">Client</label>
                      <input className="admin-input" style={{ padding: "6px 10px" }} value={work.client} onChange={(e) => update(i, "client", e.target.value)} />
                    </div>
                  </div>
                  <div className="admin-col">
                    <ImageUpload label="Thumbnail" value={work.thumbnail || ""} onChange={(url) => update(i, "thumbnail", url)} />
                  </div>
                </div>

                {/* tags */}
                <div className="admin-form-group">
                  <label className="admin-label">Tags</label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(i, tag)}
                        className={`admin-btn ${work.tags?.includes(tag) ? "admin-btn-primary" : "admin-btn-secondary"}`}
                        style={{ fontSize: "12px", padding: "4px 12px" }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* challenge / approach / results — 3 cols */}
                <div className="admin-row">
                  <div className="admin-col">
                    <div className="admin-form-group">
                      <label className="admin-label">Challenge</label>
                      <textarea className="admin-input" rows={3} style={{ resize: "vertical" }} value={work.challenge || ""} onChange={(e) => update(i, "challenge", e.target.value)} />
                    </div>
                  </div>
                  <div className="admin-col">
                    <div className="admin-form-group">
                      <label className="admin-label">Approach</label>
                      <textarea className="admin-input" rows={3} style={{ resize: "vertical" }} value={work.approach || ""} onChange={(e) => update(i, "approach", e.target.value)} />
                    </div>
                  </div>
                  <div className="admin-col">
                    <div className="admin-form-group">
                      <label className="admin-label">Results</label>
                      <textarea className="admin-input" rows={3} style={{ resize: "vertical" }} value={work.results || ""} onChange={(e) => update(i, "results", e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* gallery */}
                <div className="admin-form-group">
                  <label className="admin-label">Gallery</label>
                  {(work.gallery || []).map((url, gi) => (
                    <div key={gi} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-end" }}>
                      <div style={{ flex: 1 }}>
                        <ImageUpload label="" value={url} onChange={(val) => updateGallery(i, gi, val)} />
                      </div>
                      <button className="admin-btn admin-btn-danger" onClick={() => removeGallery(i, gi)} style={{ marginBottom: 4 }}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                  <button className="admin-btn admin-btn-secondary" onClick={() => addGalleryItem(i)} style={{ marginTop: "4px" }}>
                    <i className="fas fa-plus"></i> Add Image
                  </button>
                </div>

                {/* metrics */}
                <div className="admin-form-group">
                  <label className="admin-label">Metrics</label>
                  {(work.metrics || []).map((metric, mi) => (
                    <div key={mi} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                      <input
                        className="admin-input"
                        style={{ padding: "6px 10px", flex: 1 }}
                        value={metric.value}
                        onChange={(e) => updateMetric(i, mi, "value", e.target.value)}
                        placeholder="e.g. 2.5M"
                      />
                      <input
                        className="admin-input"
                        style={{ padding: "6px 10px", flex: 2 }}
                        value={metric.label}
                        onChange={(e) => updateMetric(i, mi, "label", e.target.value)}
                        placeholder="e.g. Total Reach"
                      />
                      <button className="admin-btn admin-btn-danger" onClick={() => removeMetric(i, mi)}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                  <button className="admin-btn admin-btn-secondary" onClick={() => addMetric(i)} style={{ marginTop: "4px" }}>
                    <i className="fas fa-plus"></i> Add Metric
                  </button>
                </div>

                {/* actions */}
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button className="admin-btn admin-btn-primary" onClick={() => handleSave(i)} disabled={saving === i}>
                    <i className="fas fa-save"></i> {saving === i ? "Saving..." : "Save"}
                  </button>
                  <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(i)}>
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
      <SeoMetabox page="works" />
    </>
  );
}

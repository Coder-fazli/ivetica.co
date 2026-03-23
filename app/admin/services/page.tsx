"use client";

import { useState, useEffect } from "react";
import { getServices, updateService, createService, deleteService } from "@/actions/services";
import SeoMetabox from "@/components/admin/SeoMetabox";

type Service = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  features: string[];
  icon: string;
  image: string;
};

const empty: Service = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  features: [],
  icon: "",
  image: "",
};

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const [saving, setSaving] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [dirtyIndexes, setDirtyIndexes] = useState<Set<number>>(new Set());

  useEffect(() => {
    getServices().then((data) => setServices(data as Service[]));
  }, []);

  // Warn on browser close / refresh when there are unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyIndexes.size > 0) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirtyIndexes]);

  function markDirty(index: number) {
    setDirtyIndexes((prev) => new Set(prev).add(index));
  }

  function markClean(index: number) {
    setDirtyIndexes((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  }

  function update(index: number, field: keyof Service, value: string | string[]) {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
    markDirty(index);
  }

  function addFeature(index: number) {
    const updated = [...services];
    updated[index].features = [...updated[index].features, ""];
    setServices(updated);
    markDirty(index);
  }

  function updateFeature(serviceIndex: number, featureIndex: number, value: string) {
    const updated = [...services];
    updated[serviceIndex].features[featureIndex] = value;
    setServices(updated);
    markDirty(serviceIndex);
  }

  function removeFeature(serviceIndex: number, featureIndex: number) {
    const updated = [...services];
    updated[serviceIndex].features = updated[serviceIndex].features.filter((_, i) => i !== featureIndex);
    setServices(updated);
    markDirty(serviceIndex);
  }

  async function handleSave(index: number) {
    setSaving(index);
    setMessage("");
    try {
      const s = services[index];
      if (s.slug) {
        await updateService(s.slug, s);
      } else {
        await createService(s);
      }
      markClean(index);
      setMessage("Saved!");
    } catch {
      setMessage("Failed to save.");
    }
    setSaving(null);
  }

  async function handleDelete(index: number) {
    const s = services[index];
    if (!s.slug) {
      setServices(services.filter((_, i) => i !== index));
      markClean(index);
      return;
    }
    await deleteService(s.slug);
    setServices(services.filter((_, i) => i !== index));
    markClean(index);
    if (open === index) setOpen(null);
  }

  function addService() {
    setServices([...services, { ...empty }]);
    setOpen(services.length);
  }

  return (
    <>
      <div className="admin-page-header">
        <h1>Services</h1>
        <p>Manage your service pages</p>
      </div>

      {message && <div className="admin-alert admin-alert-success">{message}</div>}

      {dirtyIndexes.size > 0 && (
        <div className="admin-alert admin-alert-error" style={{ marginBottom: "16px" }}>
          <i className="fas fa-exclamation-triangle" style={{ marginRight: "8px" }}></i>
          You have unsaved changes in {dirtyIndexes.size} service{dirtyIndexes.size > 1 ? "s" : ""}.
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>All Services ({services.length})</h3>
          <button className="admin-btn admin-btn-secondary" onClick={addService}>
            <i className="fas fa-plus"></i> Add Service
          </button>
        </div>

        {services.map((service, i) => (
          <div key={i} style={{ borderBottom: "1px solid var(--admin-input-border)" }}>

            {/* Toggler Header */}
            <div
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 0",
                cursor: "pointer",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 500, fontSize: "14px" }}>
                {service.title || "New Service"}
                {dirtyIndexes.has(i) && (
                  <span style={{ fontSize: "10px", color: "var(--admin-accent)", background: "rgba(255,152,0,0.1)", padding: "2px 7px", borderRadius: "4px" }}>
                    unsaved
                  </span>
                )}
              </span>
              <i className={`fas fa-chevron-${open === i ? "up" : "down"}`} style={{ color: "var(--admin-muted)", fontSize: "12px" }}></i>
            </div>

            {/* Expanded Fields */}
            {open === i && (
              <div style={{ paddingBottom: "20px" }}>
                <div className="admin-row">
                  <div className="admin-col">
                    <div className="admin-form-group">
                      <label className="admin-label">Title (HTML allowed)</label>
                      <input className="admin-input" style={{ padding: "6px 10px" }} value={service.title} onChange={(e) => update(i, "title", e.target.value)} />
                    </div>
                  </div>
                  <div className="admin-col">
                    <div className="admin-form-group">
                      <label className="admin-label">Slug (URL)</label>
                      <input className="admin-input" style={{ padding: "6px 10px" }} value={service.slug} onChange={(e) => update(i, "slug", e.target.value)} placeholder="e.g. branding" />
                    </div>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Short Description</label>
                  <input className="admin-input" style={{ padding: "6px 10px" }} value={service.shortDescription} onChange={(e) => update(i, "shortDescription", e.target.value)} />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Full Description</label>
                  <textarea className="admin-input" style={{ minHeight: "80px", padding: "6px 10px" }} value={service.description} onChange={(e) => update(i, "description", e.target.value)} />
                </div>

                {/* Features */}
                <div className="admin-form-group">
                  <label className="admin-label">Features</label>
                  {service.features.map((feature, fi) => (
                    <div key={fi} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                      <input
                        className="admin-input"
                        style={{ padding: "6px 10px" }}
                        value={feature}
                        onChange={(e) => updateFeature(i, fi, e.target.value)}
                        placeholder="Feature name"
                      />
                      <button className="admin-btn admin-btn-danger" onClick={() => removeFeature(i, fi)}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                  <button className="admin-btn admin-btn-secondary" onClick={() => addFeature(i)} style={{ marginTop: "4px" }}>
                    <i className="fas fa-plus"></i> Add Feature
                  </button>
                </div>

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
      <SeoMetabox page="services" />
    </>
  );
}

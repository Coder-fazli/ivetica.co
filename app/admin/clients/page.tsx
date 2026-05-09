"use client";

import { useState, useEffect } from "react";

type Tag = { _id: string; name: string };
type Client = { _id: string; name: string; tags: string[] };

const empty: Omit<Client, "_id"> = { name: "", tags: [] };

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState<(Omit<Client, "_id"> & { _id?: string }) | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/clients").then(r => r.json()),
      fetch("/api/tags").then(r => r.json()),
    ]).then(([c, t]) => {
      setClients(Array.isArray(c) ? c : []);
      setTags(Array.isArray(t) ? t : []);
      setLoading(false);
    });
  }, []);

  function showMsg(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500);
  }

  function openNew() {
    setModal({ ...empty, tags: [] });
    setIsEditing(false);
  }

  function openEdit(client: Client) {
    setModal({ ...client });
    setIsEditing(true);
  }

  function closeModal() {
    setModal(null);
  }

  function toggleTag(tagName: string) {
    if (!modal) return;
    setModal(prev => {
      if (!prev) return prev;
      const exists = prev.tags.includes(tagName);
      return { ...prev, tags: exists ? prev.tags.filter(t => t !== tagName) : [...prev.tags, tagName] };
    });
  }

  async function handleSave() {
    if (!modal || !modal.name.trim()) return;
    setSaving(true);
    try {
      const method = isEditing ? "PUT" : "POST";
      const body = isEditing
        ? JSON.stringify({ id: modal._id, name: modal.name.trim(), tags: modal.tags })
        : JSON.stringify({ name: modal.name.trim(), tags: modal.tags });

      const res = await fetch("/api/clients", {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      const saved = await res.json();

      if (isEditing) {
        setClients(prev => prev.map(c => c._id === saved._id ? saved : c));
      } else {
        setClients(prev => [...prev, saved].sort((a, b) => a.name.localeCompare(b.name)));
      }

      closeModal();
      showMsg(isEditing ? "Client updated!" : "Client added!");
    } catch (err) {
      showMsg(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this client?")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/clients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete");
      }

      setClients(prev => prev.filter(c => c._id !== id));
      showMsg("Client deleted!");
    } catch (err) {
      showMsg(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Clients</h1>
          <p>Manage clients and their categories (tags).</p>
        </div>
        {message && (
          <div style={{ padding: "8px 12px", background: message.includes("Failed") ? "rgba(229,51,51,0.1)" : "rgba(76,175,80,0.1)", color: message.includes("Failed") ? "#e53" : "#4caf50", borderRadius: 4, fontSize: 12 }}>
            {message}
          </div>
        )}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>All Clients ({clients.length})</h3>
          <button className="admin-btn admin-btn-secondary" onClick={openNew}>
            <i className="fas fa-plus"></i> Add Client
          </button>
        </div>

        {loading ? (
          <p style={{ fontSize: 13, opacity: 0.4, padding: "12px 0" }}>Loading...</p>
        ) : clients.length === 0 ? (
          <p style={{ fontSize: 13, opacity: 0.4, padding: "12px 0" }}>No clients yet. Add your first one.</p>
        ) : (
          clients.map(client => (
            <div key={client._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--admin-input-border)" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{client.name}</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                  {client.tags.length === 0
                    ? <span style={{ fontSize: 11, opacity: 0.3 }}>No tags</span>
                    : client.tags.map(t => (
                      <span key={t} style={{ fontSize: 11, padding: "1px 7px", borderRadius: 20, background: "var(--admin-accent)", color: "#fff" }}>{t}</span>
                    ))
                  }
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => openEdit(client)}
                  className="admin-btn"
                  style={{ fontSize: 11, padding: "4px 10px", background: "transparent", border: "1px solid var(--admin-input-border)" }}
                  disabled={saving}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(client._id)}
                  className="admin-btn"
                  style={{ fontSize: 11, padding: "4px 10px", background: "transparent", border: "1px solid #e53", color: "#e53" }}
                  disabled={saving}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{ background: "var(--admin-card-bg, #fff)", borderRadius: 10, width: "100%", maxWidth: 480, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--admin-input-border)" }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{isEditing ? "Edit Client" : "New Client"}</span>
              <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, opacity: 0.4, lineHeight: 1, color: "inherit" }}>×</button>
            </div>

            <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.4, marginBottom: 5, display: "block" }}>Client Name</span>
                <input
                  className="admin-input"
                  value={modal.name}
                  onChange={(e) => setModal(prev => prev ? { ...prev, name: e.target.value } : prev)}
                  placeholder="e.g. Nike"
                  style={{ width: "100%", boxSizing: "border-box" }}
                  disabled={saving}
                />
              </div>

              <div>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.4, marginBottom: 8, display: "block" }}>Categories (Tags)</span>
                {tags.length === 0 ? (
                  <p style={{ fontSize: 12, opacity: 0.4 }}>No tags yet. Add tags in the Tags section first.</p>
                ) : (
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {tags.map(tag => {
                      const active = modal.tags.includes(tag.name);
                      return (
                        <button
                          key={tag._id}
                          onClick={() => toggleTag(tag.name)}
                          style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, border: "1px solid var(--admin-input-border)", cursor: "pointer", background: active ? "var(--admin-accent)" : "transparent", color: active ? "#fff" : "inherit", fontWeight: 500 }}
                          disabled={saving}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, padding: "12px 20px", borderTop: "1px solid var(--admin-input-border)" }}>
              <button
                onClick={handleSave}
                className="admin-btn-primary"
                disabled={saving || !modal.name.trim()}
              >
                {saving ? "Saving..." : isEditing ? "Save Changes" : "Add Client"}
              </button>
              <button onClick={closeModal} className="admin-btn" disabled={saving}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

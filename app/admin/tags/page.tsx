"use client";

import { useState, useEffect } from "react";

type Tag = {
  _id: string;
  name: string;
  createdAt: string;
};

export default function AdminTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {
    setLoading(true);
    try {
      const res = await fetch("/api/tags");
      const data = await res.json();
      setTags(Array.isArray(data) ? data : []);
    } catch {
      setTags([]);
    }
    setLoading(false);
  }

  async function handleAddTag(e: React.FormEvent) {
    e.preventDefault();
    if (!newTagName.trim()) return;

    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add tag");
      }

      setNewTagName("");
      setMessage("Tag added!");
      await fetchTags();
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to add tag");
    } finally {
      setSaving(false);
    }
  }

  async function handleEditTag(id: string, name: string) {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/tags", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update tag");
      }

      setEditingId(null);
      setEditingName("");
      setMessage("Tag updated!");
      await fetchTags();
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to update tag");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTag(id: string) {
    if (!confirm("Delete this tag?")) return;

    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/tags", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete tag");
      }

      setMessage("Tag deleted!");
      await fetchTags();
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to delete tag");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>Work Tags</h1>
        <p>Manage project categories and tags</p>
      </div>

      <div style={{ padding: 24, maxWidth: 600 }}>
        {/* Add new tag */}
        <form onSubmit={handleAddTag} style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #1e1e1e" }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em", color: "#aaa" }}>
            Add New Tag
          </h2>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Tag name (e.g., Branding)"
              className="admin-input"
              disabled={saving}
            />
            <button type="submit" className="admin-btn-primary" disabled={saving || !newTagName.trim()}>
              {saving ? "Adding..." : "Add"}
            </button>
          </div>
        </form>

        {/* Tag list */}
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em", color: "#aaa" }}>
            All Tags ({tags.length})
          </h2>

          {message && (
            <div style={{ padding: "12px 16px", marginBottom: 16, background: message.includes("Failed") ? "rgba(229, 51, 51, 0.1)" : "rgba(76, 175, 80, 0.1)", color: message.includes("Failed") ? "#e53" : "#4caf50", borderRadius: 4, fontSize: 12 }}>
              {message}
            </div>
          )}

          {loading ? (
            <p style={{ opacity: 0.4, fontSize: 13 }}>Loading tags...</p>
          ) : tags.length === 0 ? (
            <p style={{ opacity: 0.4, fontSize: 13 }}>No tags yet. Create your first one above.</p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {tags.map((tag) => (
                <div
                  key={tag._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: "#1a1a1a",
                    borderRadius: 8,
                    border: "1px solid #1e1e1e",
                  }}
                >
                  {editingId === tag._id ? (
                    <>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="admin-input"
                        style={{ flex: 1 }}
                        disabled={saving}
                      />
                      <button
                        onClick={() => handleEditTag(tag._id, editingName)}
                        className="admin-btn-primary"
                        style={{ fontSize: 12, padding: "6px 12px" }}
                        disabled={saving}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="admin-btn"
                        style={{ fontSize: 12, padding: "6px 12px", background: "transparent", border: "1px solid #333" }}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span style={{ flex: 1, fontSize: 13 }}>{tag.name}</span>
                      <button
                        onClick={() => {
                          setEditingId(tag._id);
                          setEditingName(tag.name);
                        }}
                        className="admin-btn"
                        style={{ fontSize: 11, padding: "4px 10px", background: "transparent", border: "1px solid #333" }}
                        disabled={saving}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag._id)}
                        className="admin-btn"
                        style={{ fontSize: 11, padding: "4px 10px", background: "transparent", border: "1px solid #e53", color: "#e53" }}
                        disabled={saving}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

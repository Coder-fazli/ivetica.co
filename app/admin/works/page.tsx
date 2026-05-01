"use client";

import { useState, useEffect } from "react";
import { getWorks, updateWork, createWork, deleteWork } from "@/actions/works";
import { WorkType, Block, MediaItem } from "@/types";
import SeoMetabox from "@/components/admin/SeoMetabox";
import MediaUpload from "@/components/admin/MediaUpload";

const TAGS = ["Art & Culture", "Tech", "Fashion", "Entertainment", "Hospitality", "Retail", "Finance", "Non-profit"];

const empty: WorkType = {
  title: "", slug: "", client: "", tags: [],
  thumbnail: "", challenge: "", approach: "", results: "",
  gallery: [], metrics: [], blocks: [],
};

const s: Record<string, React.CSSProperties> = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" },
  modal: { background: "var(--admin-card-bg, #fff)", borderRadius: 10, width: "100%", maxWidth: 1000, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" },
  modalHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--admin-input-border)", flexShrink: 0 },
  modalBody: { flex: 1, overflowY: "auto", padding: "18px 20px" },
  modalFoot: { display: "flex", gap: 8, padding: "12px 20px", borderTop: "1px solid var(--admin-input-border)", flexShrink: 0 },
  label: { fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", opacity: 0.4, marginBottom: 5, display: "block" },
  input: { width: "100%", fontSize: 13, padding: "0 10px", height: 34, borderRadius: 5, border: "1px solid var(--admin-input-border)", background: "var(--admin-input-bg)", color: "var(--admin-text)", outline: "none", boxSizing: "border-box" as const },
  textarea: { width: "100%", fontSize: 13, padding: "7px 10px", borderRadius: 5, border: "1px solid var(--admin-input-border)", background: "var(--admin-input-bg)", color: "var(--admin-text)", outline: "none", resize: "vertical" as const, boxSizing: "border-box" as const },
  blockBox: { border: "1px solid var(--admin-input-border)", borderRadius: 8, padding: 12, marginBottom: 8 },
  blockHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  blockType: { fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", opacity: 0.4 },
  iconBtn: { background: "none", border: "1px solid var(--admin-input-border)", borderRadius: 4, cursor: "pointer", padding: "2px 8px", fontSize: 12, color: "inherit" },
};

// SVG icon paths for each block type
const BLOCK_TYPES: { type: Block["type"]; label: string; svg: React.ReactNode }[] = [
  {
    type: "full-media", label: "Full media",
    svg: <svg width="40" height="30" viewBox="0 0 40 30"><rect x="1" y="1" width="38" height="28" rx="3" fill="currentColor" opacity="0.85"/></svg>,
  },
  {
    type: "portrait-media", label: "Portrait",
    svg: <svg width="40" height="30" viewBox="0 0 40 30"><rect x="12" y="1" width="16" height="28" rx="3" fill="currentColor" opacity="0.85"/></svg>,
  },
  {
    type: "two-column", label: "Two column",
    svg: <svg width="40" height="30" viewBox="0 0 40 30"><rect x="1" y="1" width="17" height="28" rx="3" fill="currentColor" opacity="0.85"/><rect x="22" y="1" width="17" height="28" rx="3" fill="currentColor" opacity="0.85"/></svg>,
  },
  {
    type: "media-text", label: "Media + Text",
    svg: <svg width="40" height="30" viewBox="0 0 40 30"><rect x="1" y="1" width="17" height="28" rx="3" fill="currentColor" opacity="0.85"/><rect x="22" y="6" width="17" height="3" rx="1" fill="currentColor" opacity="0.7"/><rect x="22" y="12" width="17" height="3" rx="1" fill="currentColor" opacity="0.7"/><rect x="22" y="18" width="12" height="3" rx="1" fill="currentColor" opacity="0.7"/></svg>,
  },
  {
    type: "text", label: "Label + Text",
    svg: <svg width="40" height="30" viewBox="0 0 40 30"><rect x="1" y="8" width="12" height="3" rx="1" fill="currentColor" opacity="0.5"/><rect x="17" y="6" width="22" height="3" rx="1" fill="currentColor" opacity="0.85"/><rect x="17" y="12" width="22" height="3" rx="1" fill="currentColor" opacity="0.85"/><rect x="17" y="18" width="16" height="3" rx="1" fill="currentColor" opacity="0.85"/></svg>,
  },
  {
    type: "text-full", label: "Full text",
    svg: <svg width="40" height="30" viewBox="0 0 40 30"><rect x="1" y="6" width="38" height="3" rx="1" fill="currentColor" opacity="0.85"/><rect x="1" y="12" width="38" height="3" rx="1" fill="currentColor" opacity="0.85"/><rect x="1" y="18" width="28" height="3" rx="1" fill="currentColor" opacity="0.85"/></svg>,
  },
  {
    type: "text-two-col", label: "2-col text",
    svg: <svg width="40" height="30" viewBox="0 0 40 30"><rect x="1" y="6" width="17" height="2.5" rx="1" fill="currentColor" opacity="0.85"/><rect x="1" y="11" width="17" height="2.5" rx="1" fill="currentColor" opacity="0.85"/><rect x="1" y="16" width="12" height="2.5" rx="1" fill="currentColor" opacity="0.85"/><rect x="22" y="6" width="17" height="2.5" rx="1" fill="currentColor" opacity="0.85"/><rect x="22" y="11" width="17" height="2.5" rx="1" fill="currentColor" opacity="0.85"/><rect x="22" y="16" width="12" height="2.5" rx="1" fill="currentColor" opacity="0.85"/></svg>,
  },
];

export default function AdminWorks() {
  const [works, setWorks] = useState<WorkType[]>([]);
  const [modal, setModal] = useState<WorkType | null>(null);
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getWorks().then((data) => setWorks(data as WorkType[]));
  }, []);

  function openNew() { setModal({ ...empty }); setModalIdx(null); }
  function openEdit(i: number) { setModal({ ...works[i] }); setModalIdx(i); }
  function closeModal() { setModal(null); setModalIdx(null); }

  function field(key: keyof WorkType, val: unknown) {
    setModal((prev) => prev ? { ...prev, [key]: val } : prev);
  }

  function toggleTag(tag: string) {
    if (!modal) return;
    const tags = modal.tags || [];
    field("tags", tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);
  }

  function addBlock(type: Block["type"]) {
    const emptyMedia: MediaItem = { url: "", kind: "image" };
    let b: Block;
    if (type === "full-media") b = { type: "full-media", media: emptyMedia };
    else if (type === "portrait-media") b = { type: "portrait-media", media: emptyMedia };
    else if (type === "two-column") b = { type: "two-column", left: emptyMedia, right: emptyMedia };
    else if (type === "text") b = { type: "text", label: "", body: "" };
    else if (type === "text-full") b = { type: "text-full", label: "", body: "" };
    else if (type === "text-two-col") b = { type: "text-two-col", leftLabel: "", leftBody: "", rightLabel: "", rightBody: "" };
    else b = { type: "media-text", media: emptyMedia, body: "" };
    field("blocks", [...(modal?.blocks || []), b]);
  }

  function updateBlock(bi: number, val: Partial<Block>) {
    const blocks = [...(modal?.blocks || [])];
    blocks[bi] = { ...blocks[bi], ...val } as Block;
    field("blocks", blocks);
  }

  function removeBlock(bi: number) { field("blocks", (modal?.blocks || []).filter((_, i) => i !== bi)); }

  function moveBlock(bi: number, dir: "up" | "down") {
    const blocks = [...(modal?.blocks || [])];
    const swap = dir === "up" ? bi - 1 : bi + 1;
    if (swap < 0 || swap >= blocks.length) return;
    [blocks[bi], blocks[swap]] = [blocks[swap], blocks[bi]];
    field("blocks", blocks);
  }

  async function handleSave() {
    if (!modal) return;
    setSaving(true);
    setMessage("");
    try {
      if (modalIdx !== null && modal.slug) {
        await updateWork(modal.slug, modal);
        const updated = [...works]; updated[modalIdx] = modal; setWorks(updated);
      } else {
        await createWork(modal);
        setWorks([...works, modal]);
      }
      setMessage("Saved!");
      closeModal();
    } catch {
      setMessage("Failed to save.");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!modal?.slug) { closeModal(); return; }
    await deleteWork(modal.slug);
    setWorks(works.filter((_, i) => i !== modalIdx));
    closeModal();
  }

  return (
    <>
      <div className="admin-page-header">
        <h1>Works</h1>
        <p>Manage your portfolio projects</p>
      </div>

      {message && <div className="admin-alert admin-alert-success">{message}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>All Works ({works.length})</h3>
          <button className="admin-btn admin-btn-secondary" onClick={openNew}>
            <i className="fas fa-plus"></i> Add Work
          </button>
        </div>

        {works.length === 0 && (
          <p style={{ fontSize: 13, opacity: 0.4, padding: "12px 0" }}>No works yet.</p>
        )}

        {works.map((w, i) => (
          <div
            key={i}
            onClick={() => openEdit(i)}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--admin-input-border)", cursor: "pointer" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {w.thumbnail
                ? <img src={w.thumbnail} alt="" style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4 }} />
                : <div style={{ width: 36, height: 36, borderRadius: 4, background: "var(--admin-input-bg)", border: "1px solid var(--admin-input-border)" }} />
              }
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{w.title || "Untitled"}</div>
                <div style={{ fontSize: 11, opacity: 0.4 }}>{w.client}{w.blocks?.length ? ` · ${w.blocks.length} blocks` : ""}</div>
              </div>
            </div>
            <i className="fas fa-chevron-right" style={{ fontSize: 11, opacity: 0.3 }}></i>
          </div>
        ))}
      </div>

      <SeoMetabox page="works" />

      {modal && (
        <div style={s.overlay} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div style={s.modal}>

            {/* header */}
            <div style={s.modalHead}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{modalIdx !== null ? modal.title || "Edit Work" : "New Work"}</span>
              <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, opacity: 0.4, lineHeight: 1, color: "inherit" }}>×</button>
            </div>

            {/* body */}
            <div style={s.modalBody}>

              {/* thumbnail + basic fields */}
              <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 16, alignItems: "start", marginBottom: 18 }}>

                {/* thumbnail via MediaPicker */}
                <div>
                  <span style={s.label}>Thumbnail</span>
                  <div style={{ width: 110, height: 110, borderRadius: 8, border: "1.5px dashed var(--admin-input-border)", overflow: "hidden", background: "var(--admin-input-bg)", marginBottom: 6 }}>
                    {modal.thumbnail
                      ? <img src={modal.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2, fontSize: 11 }}>Photo</div>
                    }
                  </div>
                  <MediaUpload
                    value={{ url: modal.thumbnail || "", kind: "image" }}
                    onChange={(m) => field("thumbnail", m.url)}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8 }}>
                    <div>
                      <span style={s.label}>Title</span>
                      <input style={s.input} value={modal.title} onChange={(e) => field("title", e.target.value)} placeholder="Nike Run" />
                    </div>
                    <div>
                      <span style={s.label}>Slug</span>
                      <input style={s.input} value={modal.slug} onChange={(e) => field("slug", e.target.value)} placeholder="nike-run" />
                    </div>
                    <div>
                      <span style={s.label}>Client</span>
                      <input style={s.input} value={modal.client} onChange={(e) => field("client", e.target.value)} placeholder="Nike" />
                    </div>
                  </div>
                  <div>
                    <span style={s.label}>Tags</span>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {TAGS.map(tag => {
                        const active = modal.tags?.includes(tag) ?? false;
                        return (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, border: "1px solid var(--admin-input-border)", cursor: "pointer", background: active ? "var(--admin-accent)" : "transparent", color: active ? "#fff" : "inherit", fontWeight: 500 }}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* blocks */}
              <div>
                <span style={s.label}>Content Blocks</span>

                {(modal.blocks || []).map((block, bi) => (
                  <div key={bi} style={s.blockBox}>
                    <div style={s.blockHead}>
                      <span style={s.blockType}>
                        {BLOCK_TYPES.find(bt => bt.type === block.type)?.label ?? block.type}
                      </span>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button style={s.iconBtn} onClick={() => moveBlock(bi, "up")}>↑</button>
                        <button style={s.iconBtn} onClick={() => moveBlock(bi, "down")}>↓</button>
                        <button style={{ ...s.iconBtn, color: "#e53" }} onClick={() => removeBlock(bi)}>×</button>
                      </div>
                    </div>

                    {(block.type === "full-media" || block.type === "portrait-media") && (
                      <MediaUpload label="Media" value={block.media} onChange={(m) => updateBlock(bi, { media: m })} />
                    )}
                    {block.type === "two-column" && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <MediaUpload label="Left" value={block.left} onChange={(m) => updateBlock(bi, { left: m })} />
                        <MediaUpload label="Right" value={block.right} onChange={(m) => updateBlock(bi, { right: m })} />
                      </div>
                    )}
                    {block.type === "media-text" && (
                      <>
                        <MediaUpload label="Media" value={block.media} onChange={(m) => updateBlock(bi, { media: m })} />
                        <textarea style={{ ...s.textarea, marginTop: 8 }} rows={2} placeholder="Text (right side)" value={block.body} onChange={(e) => updateBlock(bi, { body: e.target.value })} />
                      </>
                    )}
                    {block.type === "text" && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
                        <input style={s.input} placeholder="Label" value={block.label} onChange={(e) => updateBlock(bi, { label: e.target.value })} />
                        <textarea style={s.textarea} rows={2} placeholder="Body text" value={block.body} onChange={(e) => updateBlock(bi, { body: e.target.value })} />
                      </div>
                    )}
                    {block.type === "text-full" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <input style={s.input} placeholder="Label (optional)" value={block.label} onChange={(e) => updateBlock(bi, { label: e.target.value })} />
                        <textarea style={s.textarea} rows={3} placeholder="Body text" value={block.body} onChange={(e) => updateBlock(bi, { body: e.target.value })} />
                      </div>
                    )}
                    {block.type === "text-two-col" && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <input style={s.input} placeholder="Left label" value={block.leftLabel} onChange={(e) => updateBlock(bi, { leftLabel: e.target.value })} />
                          <textarea style={s.textarea} rows={2} placeholder="Left body" value={block.leftBody} onChange={(e) => updateBlock(bi, { leftBody: e.target.value })} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <input style={s.input} placeholder="Right label" value={block.rightLabel} onChange={(e) => updateBlock(bi, { rightLabel: e.target.value })} />
                          <textarea style={s.textarea} rows={2} placeholder="Right body" value={block.rightBody} onChange={(e) => updateBlock(bi, { rightBody: e.target.value })} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* visual block type picker */}
                <div style={{ marginTop: 6 }}>
                  <span style={{ ...s.label, marginBottom: 8 }}>Add block</span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
                    {BLOCK_TYPES.map(bt => (
                      <button
                        key={bt.type}
                        onClick={() => addBlock(bt.type)}
                        title={bt.label}
                        style={{
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                          padding: "10px 6px 8px", borderRadius: 7,
                          border: "1px solid var(--admin-input-border)",
                          background: "var(--admin-input-bg)",
                          cursor: "pointer", color: "var(--admin-text)",
                          transition: "border-color 0.15s, background 0.15s",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--admin-accent)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--admin-input-border)"; }}
                      >
                        {bt.svg}
                        <span style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.5, lineHeight: 1.2, textAlign: "center" }}>{bt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* footer */}
            <div style={s.modalFoot}>
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1 }}>
                {saving ? "Saving..." : "Save"}
              </button>
              {modalIdx !== null && (
                <button className="admin-btn admin-btn-danger" onClick={handleDelete}>Delete</button>
              )}
              <button className="admin-btn admin-btn-secondary" onClick={closeModal}>Cancel</button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

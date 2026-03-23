"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback, useRef } from "react";
import nextDynamic from "next/dynamic";
import { getPosts, createPost, updatePost, deletePost, PostType } from "@/actions/posts";
import SeoMetabox from "@/components/admin/SeoMetabox";

const TipTapEditor = nextDynamic(() => import("@/components/blog/TipTapEditor"), { ssr: false });

function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const emptyDraft = () => ({
  title: "",
  slug: "",
  category: "",
  author: "",
  excerpt: "",
  coverImage: "",
  content: "",
  published: false,
  seo: { metaTitle: "", metaDescription: "" },
});

type View = "list" | "edit";

export default function AdminBlog() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [view, setView] = useState<View>("list");
  const [activeId, setActiveId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const slugLocked = useRef(false); // true once user manually edits slug

  useEffect(() => { getPosts().then(setPosts); }, []);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (isDirty) e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  function openNew() {
    if (isDirty && !confirm("Unsaved changes will be lost. Continue?")) return;
    setDraft(emptyDraft());
    setActiveId("new");
    setIsDirty(false);
    setSeoOpen(false);
    slugLocked.current = false;
    setView("edit");
  }

  function openPost(post: PostType) {
    if (isDirty && !confirm("Unsaved changes will be lost. Continue?")) return;
    slugLocked.current = true; // existing post — slug is already set
    setDraft({
      title: post.title,
      slug: post.slug || "",
      category: post.category,
      author: post.author,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      content: post.content,
      published: post.published,
      seo: post.seo ?? { metaTitle: "", metaDescription: "" },
    });
    setActiveId(post._id!);
    setIsDirty(false);
    setSeoOpen(false);
    setView("edit");
  }

  function backToList() {
    if (isDirty && !confirm("Unsaved changes will be lost. Continue?")) return;
    setView("list");
    setActiveId(null);
    setIsDirty(false);
    setMessage("");
  }

  const set = useCallback((field: string, value: unknown) => {
    if (field === "slug") slugLocked.current = true;
    setDraft((prev) => {
      const next = { ...prev, [field]: value };
      // auto-sync slug from title until user manually edits slug
      if (field === "title" && !slugLocked.current) {
        next.slug = toSlug(value as string);
      }
      return next;
    });
    setIsDirty(true);
  }, []);

  function setSeo(field: string, value: string) {
    setDraft((prev) => ({ ...prev, seo: { ...prev.seo, [field]: value } }));
    setIsDirty(true);
  }

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json();
    if (json.url) { set("coverImage", json.url); }
    setCoverUploading(false);
    if (coverFileRef.current) coverFileRef.current.value = "";
  }

  async function save(published: boolean) {
    setSaving(true);
    setMessage("");
    const data = { ...draft, published };

    if (activeId === "new") {
      const created = await createPost(data);
      setPosts((prev) => [created, ...prev]);
      setActiveId(created._id!);
    } else {
      await updatePost(activeId!, data);
      setPosts((prev) => prev.map((p) => p._id === activeId ? { ...p, ...data } : p));
    }

    setDraft((prev) => ({ ...prev, published }));
    setIsDirty(false);
    setSaving(false);
    setMessage(published ? "Published" : "Draft saved");
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post permanently?")) return;
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p._id !== id));
    if (activeId === id) { backToList(); }
  }

  function formatDate(str?: string) {
    if (!str) return "—";
    return new Date(str).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  /* ---- LIST VIEW ---- */
  if (view === "list") {
    return (
      <>
        <div className="admin-page-header">
          <div>
            <h1>Blog</h1>
            <p>Manage your posts.</p>
          </div>
          <button onClick={openNew} className="admin-btn-primary">
            <i className="fas fa-plus"></i> New Post
          </button>
        </div>

        <div className="wp-posts-table-wrap">
          {posts.length === 0 ? (
            <div className="wp-posts-empty">
              <i className="fas fa-pen-nib"></i>
              <p>No posts yet. Create your first post.</p>
              <button className="admin-btn-primary" onClick={openNew}>
                <i className="fas fa-plus"></i> New Post
              </button>
            </div>
          ) : (
            <table className="wp-posts-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} onClick={() => openPost(post)} className="wp-posts-row">
                    <td className="wp-posts-title">
                      {post.title || <span style={{ color: "#aaa", fontStyle: "italic" }}>Untitled</span>}
                    </td>
                    <td>{post.author || "—"}</td>
                    <td>{post.category || "—"}</td>
                    <td>
                      <span className={`wp-status-badge${post.published ? " published" : ""}`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td>{formatDate(post.createdAt)}</td>
                    <td className="wp-posts-actions" onClick={(e) => e.stopPropagation()}>
                      <button className="wp-edit-btn" onClick={() => openPost(post)} title="Edit">
                        <i className="fas fa-pen"></i>
                      </button>
                      <button className="wp-delete-btn" onClick={() => handleDelete(post._id!)} title="Delete">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      <SeoMetabox page="blog" />
    </>
    );
  }

  /* ---- EDIT VIEW ---- */
  return (
    <div className="wp-editor-page">

      {/* Top bar */}
      <div className="wp-editor-topbar">
        <button className="wp-back-btn" onClick={backToList}>
          <i className="fas fa-arrow-left"></i> All Posts
        </button>
        <div className="wp-editor-topbar-center">
          {message && <span className="wp-save-msg">{message}</span>}
          {isDirty && !message && <span className="wp-unsaved-msg">● Unsaved changes</span>}
        </div>
        <div className="wp-editor-topbar-right">
          {draft.published && (draft.slug || activeId !== "new") && (
            <a
              href={`/blog/${draft.slug || activeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="wp-view-btn"
            >
              <i className="fas fa-external-link-alt"></i> View Post
            </a>
          )}
          {activeId && activeId !== "new" && (
            <button
              className="wp-trash-topbar-btn"
              onClick={() => handleDelete(activeId as string)}
              title="Move to Trash"
            >
              <i className="fas fa-trash"></i>
            </button>
          )}
          <button onClick={() => save(false)} disabled={saving} className="wp-draft-btn">
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button onClick={() => save(true)} disabled={saving} className="wp-publish-btn">
            {saving ? "..." : draft.published ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {/* Editor body */}
      <div className="wp-editor-body">

        {/* Main content column */}
        <div className="wp-editor-content">
          <input
            className="wp-title-input"
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Add title"
          />
          <div className="wp-tiptap-wrap">
            <TipTapEditor value={draft.content} onChange={(html) => set("content", html)} />
          </div>
        </div>

        {/* Right settings sidebar */}
        <div className="wp-editor-sidebar">

          {/* Status panel */}
          <div className="wp-panel">
            <div className="wp-panel-header">
              <span>Status</span>
            </div>
            <div className="wp-panel-body">
              <div className="wp-panel-row">
                <span className="wp-panel-label">Visibility</span>
                <span className={`wp-status-badge${draft.published ? " published" : ""}`}>
                  {draft.published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          </div>

          {/* Post Details panel */}
          <div className="wp-panel">
            <div className="wp-panel-header">
              <span>Post Details</span>
            </div>
            <div className="wp-panel-body">
              <div className="wp-field">
                <label>Slug</label>
                <div className="wp-slug-wrap">
                  <span className="wp-slug-prefix">/blog/</span>
                  <input
                    value={draft.slug}
                    onChange={(e) => set("slug", toSlug(e.target.value))}
                    placeholder="my-post-title"
                    className="wp-slug-input"
                  />
                </div>
              </div>
              <div className="wp-field">
                <label>Category</label>
                <input value={draft.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Influencer" />
              </div>
              <div className="wp-field">
                <label>Author</label>
                <input value={draft.author} onChange={(e) => set("author", e.target.value)} placeholder="Author name" />
              </div>
              <div className="wp-field">
                <label>Excerpt</label>
                <textarea
                  value={draft.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                  placeholder="Short description shown in post previews"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Featured Image panel */}
          <div className="wp-panel">
            <div className="wp-panel-header">
              <span>Cover Image</span>
            </div>
            <div className="wp-panel-body">
              {draft.coverImage && (
                <img src={draft.coverImage} alt="" className="wp-cover-thumb" />
              )}
              <input
                className="wp-field-input"
                value={draft.coverImage}
                onChange={(e) => set("coverImage", e.target.value)}
                placeholder="Paste image URL"
              />
              <input ref={coverFileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadCover} style={{ display: "none" }} />
              <button className="wp-upload-btn" onClick={() => coverFileRef.current?.click()} disabled={coverUploading}>
                <i className="fas fa-upload"></i> {coverUploading ? "Uploading..." : "Upload Image"}
              </button>
            </div>
          </div>

          {/* SEO panel */}
          <div className="wp-panel">
            <div className="wp-panel-header" style={{ cursor: "pointer" }} onClick={() => setSeoOpen((v) => !v)}>
              <span>SEO</span>
              <i className={`fas fa-chevron-${seoOpen ? "up" : "down"}`} style={{ fontSize: 11, color: "#aaa" }}></i>
            </div>
            {seoOpen && (
              <div className="wp-panel-body">
                <div className="wp-field">
                  <label>Meta Title <span className="wp-char-count">({draft.seo.metaTitle.length}/60)</span></label>
                  <input value={draft.seo.metaTitle} onChange={(e) => setSeo("metaTitle", e.target.value)} placeholder="SEO title" />
                </div>
                <div className="wp-field">
                  <label>Meta Description <span className="wp-char-count">({draft.seo.metaDescription.length}/160)</span></label>
                  <textarea
                    value={draft.seo.metaDescription}
                    onChange={(e) => setSeo("metaDescription", e.target.value)}
                    placeholder="SEO description"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  );
}

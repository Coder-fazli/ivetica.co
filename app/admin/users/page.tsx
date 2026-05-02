"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  createdAt: number;
  lastSignInAt: number | null;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMsg, setInviteMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteMsg(null);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail }),
    });
    const data = await res.json();
    if (data.ok) {
      setInviteMsg({ type: "ok", text: `Invitation sent to ${inviteEmail}` });
      setInviteEmail("");
    } else {
      setInviteMsg({ type: "err", text: data.error || "Failed to send invitation" });
    }
    setInviteLoading(false);
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`Remove ${email} from admin? This cannot be undone.`)) return;
    setDeletingId(userId);
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    setDeletingId(null);
    fetchUsers();
  };

  return (
    <>
      <div className="admin-page-header">
        <h1>Users</h1>
        <p>Manage who has access to the admin panel</p>
      </div>

      {/* Invite card */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 6, fontSize: 15 }}>Invite new admin</h3>
        <p style={{ fontSize: 13, color: "var(--admin-muted)", marginBottom: 16 }}>
          They will receive an email with a link to create their account.
        </p>
        <form onSubmit={handleInvite} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="email"
            required
            placeholder="email@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="admin-input"
            style={{ flex: 1, minWidth: 220 }}
          />
          <button type="submit" className="admin-btn-primary" disabled={inviteLoading}>
            {inviteLoading ? "Sending…" : "Send invitation"}
          </button>
        </form>
        {inviteMsg && (
          <div style={{
            marginTop: 12, padding: "10px 14px", borderRadius: 8, fontSize: 13,
            background: inviteMsg.type === "ok" ? "#e8f8ee" : "#fdecea",
            color: inviteMsg.type === "ok" ? "#1e7e3e" : "#c0392b",
          }}>
            {inviteMsg.text}
          </div>
        )}
      </div>

      {/* Users list */}
      <div className="admin-card">
        <h3 style={{ marginBottom: 16, fontSize: 15 }}>All users ({users.length})</h3>

        {loading ? (
          <div style={{ padding: "30px 0", textAlign: "center", color: "var(--admin-muted)", fontSize: 13 }}>Loading…</div>
        ) : users.length === 0 ? (
          <div style={{ padding: "30px 0", textAlign: "center", color: "var(--admin-muted)", fontSize: 13 }}>No users found</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {users.map((u) => (
              <div key={u.id} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 14px", borderRadius: 8,
                background: "var(--admin-input-bg)",
                border: "1px solid var(--admin-input-border)",
              }}>
                {/* Avatar */}
                <img
                  src={u.imageUrl}
                  alt=""
                  style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--admin-text)" }}>
                    {u.firstName || u.lastName ? `${u.firstName} ${u.lastName}`.trim() : "—"}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--admin-muted)", marginTop: 1 }}>{u.email}</div>
                </div>

                {/* Dates */}
                <div style={{ fontSize: 12, color: "var(--admin-muted)", textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                  <span>{u.lastSignInAt ? `Last seen ${new Date(u.lastSignInAt).toLocaleDateString()}` : "Never signed in"}</span>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(u.id, u.email)}
                  disabled={deletingId === u.id}
                  style={{
                    background: "none", border: "1px solid var(--admin-input-border)",
                    color: "var(--admin-danger)", borderRadius: 6, padding: "6px 12px",
                    fontSize: 12, cursor: "pointer", flexShrink: 0,
                  }}
                >
                  {deletingId === u.id ? "…" : "Remove"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

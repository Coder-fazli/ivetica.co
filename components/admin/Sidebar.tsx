"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { UserButton, useClerk } from "@clerk/nextjs";

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    const url = document.body.dataset.logo;
    if (url) setLogoUrl(url);
  }, []);

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "fas fa-th-large" },
    { href: "/admin/works", label: "Works", icon: "fas fa-briefcase" },
    { href: "/admin/clients", label: "Clients", icon: "fas fa-building" },
    { href: "/admin/tags", label: "Tags", icon: "fas fa-tags" },
    { href: "/admin/about", label: "About", icon: "fas fa-users" },
    { href: "/admin/contact", label: "Contact", icon: "fas fa-envelope" },
    { href: "/admin/media", label: "Media", icon: "fas fa-photo-video" },
    { href: "/admin/users", label: "Users", icon: "fas fa-user-shield" },
    { href: "/admin/settings", label: "Settings", icon: "fas fa-sliders-h" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        {logoUrl
          ? <img src={logoUrl} alt="lvetica" />
          : <span style={{ color: "#fff", fontWeight: 700, fontSize: 16, letterSpacing: "0.05em" }}>lvetica</span>
        }
      </div>

      <ul className="admin-sidebar-nav">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={pathname === link.href ? "active" : ""}
            >
              <i className={link.icon}></i>
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="admin-sidebar-bottom">
        <UserButton />
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">
          <i className="fas fa-home"></i>
          <span>Back to site</span>
        </a>
        <button
          onClick={() => signOut({ redirectUrl: "/sign-in" })}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", width: "100%", color: "rgba(255,255,255,0.6)", fontSize: 14 }}
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

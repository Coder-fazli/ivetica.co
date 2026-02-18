"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "fas fa-th-large" },
    { href: "/admin/homepage", label: "Homepage", icon: "fas fa-home" },
    { href: "/admin/portfolio", label: "Portfolio", icon: "fas fa-images" },
    { href: "/admin/blog", label: "Blog", icon: "fas fa-pen" },
    { href: "/admin/team", label: "Team", icon: "fas fa-users" },
    { href: "/admin/services", label: "Services", icon: "fas fa-cogs" },
    { href: "/admin/settings", label: "Settings", icon: "fas fa-sliders-h" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <img src="/img/lvetica-logo.png" alt="lvetica" />
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
        <a href="/">
          <i className="fas fa-sign-out-alt"></i>
          <span>Back to site</span>
        </a>
      </div>
    </aside>
  );
}

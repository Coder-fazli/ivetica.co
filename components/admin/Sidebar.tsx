"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "fas fa-th-large" },
    { href: "/admin/homepage", label: "Homepage", icon: "fas fa-home" },
    { href: "/admin/works", label: "Works", icon: "fas fa-briefcase" },
    { href: "/admin/media", label: "Media", icon: "fas fa-photo-video" },
    { href: "/admin/services", label: "Services", icon: "fas fa-cogs" },
    { href: "/admin/blog", label: "Blog", icon: "fas fa-pen" },
    { href: "/admin/about", label: "About", icon: "fas fa-users" },
    { href: "/admin/contact", label: "Contact", icon: "fas fa-envelope" },
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
        <UserButton />
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">
          <i className="fas fa-sign-out-alt"></i>
          <span>Back to site</span>
        </a>
      </div>
    </aside>
  );
}

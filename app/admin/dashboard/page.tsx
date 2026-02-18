import Link from "next/link";

export default function AdminDashboard() {
  return (
    <>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Welcome to lvetica admin panel</p>
      </div>

      <div className="admin-dashboard-grid">
        <Link href="/admin/homepage" className="admin-dashboard-card">
          <i className="fas fa-home"></i>
          <h4>Homepage</h4>
          <p>Edit hero, about, services, team</p>
        </Link>

        <Link href="/admin/portfolio" className="admin-dashboard-card">
          <i className="fas fa-images"></i>
          <h4>Portfolio</h4>
          <p>Manage your projects</p>
        </Link>

        <Link href="/admin/blog" className="admin-dashboard-card">
          <i className="fas fa-pen"></i>
          <h4>Blog</h4>
          <p>Write and manage posts</p>
        </Link>

        <Link href="/admin/team" className="admin-dashboard-card">
          <i className="fas fa-users"></i>
          <h4>Team</h4>
          <p>Manage team members</p>
        </Link>

        <Link href="/admin/services" className="admin-dashboard-card">
          <i className="fas fa-cogs"></i>
          <h4>Services</h4>
          <p>Edit your services page</p>
        </Link>

        <Link href="/admin/settings" className="admin-dashboard-card">
          <i className="fas fa-sliders-h"></i>
          <h4>Settings</h4>
          <p>Logo, socials, contact info</p>
        </Link>
      </div>
    </>
  );
}

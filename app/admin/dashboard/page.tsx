import Link from "next/link";

export default function AdminDashboard() {
  return (
    <>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Welcome to lvetica admin panel</p>
      </div>

      <div className="admin-dashboard-grid">
        <Link href="/admin/works" className="admin-dashboard-card">
          <i className="fas fa-briefcase"></i>
          <h4>Works</h4>
          <p>Manage portfolio projects, order and blocks</p>
        </Link>

        <Link href="/admin/clients" className="admin-dashboard-card">
          <i className="fas fa-building"></i>
          <h4>Clients</h4>
          <p>Manage clients and their categories</p>
        </Link>

        <Link href="/admin/about" className="admin-dashboard-card">
          <i className="fas fa-users"></i>
          <h4>About</h4>
          <p>Edit team, offerings and studio info</p>
        </Link>

        <Link href="/admin/contact" className="admin-dashboard-card">
          <i className="fas fa-envelope"></i>
          <h4>Contact</h4>
          <p>Emails, phone, location and map</p>
        </Link>

        <Link href="/admin/tags" className="admin-dashboard-card">
          <i className="fas fa-tags"></i>
          <h4>Tags</h4>
          <p>Manage work and client categories</p>
        </Link>

        <Link href="/admin/media" className="admin-dashboard-card">
          <i className="fas fa-photo-video"></i>
          <h4>Media</h4>
          <p>Upload and manage images and videos</p>
        </Link>

        <Link href="/admin/settings" className="admin-dashboard-card">
          <i className="fas fa-sliders-h"></i>
          <h4>Settings</h4>
          <p>Logo, favicon, social links, font sizes</p>
        </Link>
      </div>
    </>
  );
}

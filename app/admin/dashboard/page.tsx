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
          <p>Edit hero, about, team, partners</p>
        </Link>

        <Link href="/admin/works" className="admin-dashboard-card">
          <i className="fas fa-briefcase"></i>
          <h4>Works</h4>
          <p>Manage portfolio projects</p>
        </Link>

        <Link href="/admin/services" className="admin-dashboard-card">
          <i className="fas fa-cogs"></i>
          <h4>Services</h4>
          <p>Edit your services page</p>
        </Link>

        <Link href="/admin/about" className="admin-dashboard-card">
          <i className="fas fa-users"></i>
          <h4>About</h4>
          <p>Edit story, values and team</p>
        </Link>

        <Link href="/admin/contact" className="admin-dashboard-card">
          <i className="fas fa-envelope"></i>
          <h4>Contact</h4>
          <p>Edit contact info and map</p>
        </Link>

        <Link href="/admin/users" className="admin-dashboard-card">
          <i className="fas fa-user-shield"></i>
          <h4>Users</h4>
          <p>Manage admin access &amp; invitations</p>
        </Link>
      </div>
    </>
  );
}

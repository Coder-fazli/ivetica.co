import Sidebar from "@/components/admin/Sidebar";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import "./admin.css";

export const metadata = {
  title: "Admin — lvetica",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="admin-layout">
        <Sidebar />
        <main className="admin-main">{children}</main>
      </div>
    </AdminAuthGuard>
  );
}

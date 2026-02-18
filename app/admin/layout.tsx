import Sidebar from "@/components/admin/Sidebar";
import "./admin.css";

export const metadata = {
  title: "Admin — lvetica",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}

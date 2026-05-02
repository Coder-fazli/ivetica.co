import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import "./admin.css";

export const metadata = {
  title: "Admin — lvetica",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <ClerkProvider>
      <div className="admin-layout">
        <Sidebar />
        <main className="admin-main">{children}</main>
      </div>
    </ClerkProvider>
  );
}

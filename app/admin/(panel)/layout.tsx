import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import Breadcrumb from "@/components/admin/Breadcrumb";
import { ToastProvider } from "@/components/admin/Toast";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  // Allow ADMIN, EDITOR, VIEWER roles (staff)
  const allowedRoles = ["ADMIN", "EDITOR", "VIEWER"];
  if (!session || !allowedRoles.includes(session.role)) redirect("/admin/login");

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-dashbg">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopbar />
          <Breadcrumb />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}

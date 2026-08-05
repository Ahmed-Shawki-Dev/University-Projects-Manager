import { getCurrentUser } from "@/action/auth/me";
import AdminHeader from "@/components/AdminHeader";
import { AdminSidebar } from "@/components/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

interface IProps {
  children: React.ReactNode;
  params: Promise<{ universitySlug: string; facultySlug: string }>;
}

export default async function AdminLayout({ children, params }: IProps) {
  const { universitySlug, facultySlug } = await params;
  const userClaims = await getCurrentUser();

  if (!userClaims || userClaims.userRole !== "Admin") {
    redirect(`/app/${universitySlug}/${facultySlug}`);
  }

  return (
    <SidebarProvider>
      <AdminSidebar userClaims={userClaims} />
      <main className="flex flex-1 flex-col min-h-screen overflow-hidden">
        <AdminHeader />
        <div className="flex-1 p-6 md:p-8 container mx-auto w-full">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

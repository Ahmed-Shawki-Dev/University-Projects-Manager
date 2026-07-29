import { getCurrentUser } from "@/action/auth/me";
import AppHeader from "@/components/app-header";
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
      <main className="flex flex-1 flex-col min-h-screen overflow-hidden">
        <AppHeader />
        <div className="flex-1 p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}

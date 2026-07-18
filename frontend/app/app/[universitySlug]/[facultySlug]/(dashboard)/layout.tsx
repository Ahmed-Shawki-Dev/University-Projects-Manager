import { getCurrentUser } from "@/action/auth/me";
import { getMyProjects } from "@/action/project/getMyProjects";
import AppHeader from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import EmptyProjects from "@/components/EmptyProjects";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function FacultyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ universitySlug: string; facultySlug: string }>;
}) {
  const { universitySlug, facultySlug } = await params;
  const res = await getMyProjects({ universitySlug, facultySlug });
  const projects = res?.data ?? [];

  const userClaims = await getCurrentUser();

  return (
    <SidebarProvider>
      <AppSidebar projects={projects} userClaims={userClaims ?? undefined} />
      <main className="flex flex-1 flex-col min-h-screen overflow-hidden ">
        <AppHeader />
        <div className="flex-1 p-6 ">
          {projects.length == 0 ? <EmptyProjects /> : children}
        </div>
      </main>
    </SidebarProvider>
  );
}

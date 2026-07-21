import { getCurrentUser } from "@/action/auth/me";
import { getMyProjects } from "@/action/project/getMyProjects";
import AppHeader from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import EmptyProjects from "@/components/EmptyProjects";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

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
  if (!userClaims || userClaims.userRole !== "Student") {
    redirect(`/app/${universitySlug}/${facultySlug}/doctor-dashboard`);
  }

  return (
    <SidebarProvider>
      <AppSidebar projects={projects} userClaims={userClaims ?? undefined} />
      <main className="flex flex-1 flex-col min-h-screen overflow-hidden">
        <AppHeader />
        {projects.length == 0 ? <EmptyProjects /> : children}
      </main>
    </SidebarProvider>
  );
}

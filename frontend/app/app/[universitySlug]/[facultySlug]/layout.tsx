import AppHeader from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import EmptyProjects from "@/components/EmptyProjects";
import { SidebarProvider } from "@/components/ui/sidebar";
import { fetchApi } from "@/lib/fetchApi";
import { ProjectDto } from "@/types/schema";

export default async function FacultyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ universitySlug: string; facultySlug: string }>;
}) {
  const { universitySlug, facultySlug } = await params;
  const res = await fetchApi<ProjectDto[]>(
    `/api/universities/${universitySlug}/faculties/${facultySlug}/projects`,
  );
  const projects = res?.data ?? [];

  return (
    <SidebarProvider>
      <AppSidebar projects={projects} />
      <main className="flex flex-1 flex-col min-h-screen ">
        <AppHeader />
        <div className="flex-1 p-6 pt-20 ">
          {projects.length == 0 ? <EmptyProjects /> : children}
        </div>
      </main>
    </SidebarProvider>
  );
}

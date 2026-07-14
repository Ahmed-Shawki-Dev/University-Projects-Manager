import { getMyProjects } from "@/action/project/getMyProjects";
import AppHeader from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface IProps {
  children: React.ReactNode;
  params: Promise<{ universitySlug: string; facultySlug: string }>;
}

export default async function ProfessorLayout({ children, params }: IProps) {
  const { universitySlug, facultySlug } = await params;
  const res = await getMyProjects({ universitySlug, facultySlug });
  const projects = res?.data ?? [];

  return (
    <SidebarProvider>
      <AppSidebar projects={projects} isProfessor={true} />

      <main className="flex flex-1 flex-col min-h-screen overflow-hidden">
        <AppHeader />
        <div className="flex-1 p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}

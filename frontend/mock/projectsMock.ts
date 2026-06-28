import { Database, FolderGit2, LayoutDashboard } from "lucide-react";

// دي الـ Structure النظيفة اللي بكرة الباك إند هيرجع زيها بالظبط
export interface SidebarProject {
  id: string;
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const mockProjects: SidebarProject[] = [
  {
    id: "1",
    name: "Graduation Project",
    url: "/app/helwan/fci/projects/grad-project",
    icon: FolderGit2,
  },
  {
    id: "2",
    name: "Database Project",
    url: "/app/helwan/fci/projects/database-system",
    icon: Database,
  },
  {
    id: "3",
    name: "Dashboard",
    url: "/app/helwan/fci",
    icon: LayoutDashboard,
  },
];

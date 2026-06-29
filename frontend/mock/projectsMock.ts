import { Database, FolderGit2, LayoutDashboard } from "lucide-react";

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
    url: "/projects/grad-project",
    icon: FolderGit2,
  },
  {
    id: "2",
    name: "Database Project",
    url: "/projects/database-system",
    icon: Database,
  },
  {
    id: "3",
    name: "Dashboard",
    url: "",
    icon: LayoutDashboard,
  },
];

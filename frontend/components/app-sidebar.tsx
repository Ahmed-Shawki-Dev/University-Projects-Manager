"use client";
import AddProject from "@/app/app/[universitySlug]/[facultySlug]/projects/AddProject";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ProjectDto } from "@/types/schema";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ModeToggle } from "./ModeToggle";

interface IProps {
  projects: ProjectDto[];
}

export function AppSidebar({ projects }: IProps) {
  const params = useParams();
  const uni = params.universitySlug;
  const fac = params.facultySlug;
  return (
    <Sidebar>
      <SidebarHeader className="border-b h-14">Logo</SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between">
            <p>Projects</p>
            <AddProject />
          </SidebarGroupLabel>
          <SidebarMenu>
            {!projects || projects.length === 0 ? (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                No Projects Yet
              </div>
            ) : (
              projects?.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton>
                    <Link href={`/app/${uni}/${fac}/projects/${project.slug}`}>
                      <span>{project.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <ModeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}

"use client";
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
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            {projects?.map((project) => (
              <SidebarMenuItem key={project.id}>
                <SidebarMenuButton asChild>
                  <Link href={`/app/${uni}/${fac}/projects/${project.slug}`}>
                    <span>{project.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <ModeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}

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
import { mockProjects } from "@/mock/projectsMock";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b h-14">Logo</SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            {mockProjects.map((project) => (
              <SidebarMenuItem key={project.id}>
                <SidebarMenuButton asChild>
                  <Link href={project.url}>
                    <project.icon className="h-4 w-4" />
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

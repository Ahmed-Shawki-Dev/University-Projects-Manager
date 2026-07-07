"use client";
import CreateProjectModal from "@/app/app/[universitySlug]/[facultySlug]/(dashboard)/projects/CreateProjectModal";
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
import { useFacultyStore } from "@/stores/facultyStore";
import { ProjectDto } from "@/types/schema";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { Skeleton } from "./ui/skeleton";

interface IProps {
  projects: ProjectDto[];
}

export function AppSidebar({ projects }: IProps) {
  const params = useParams();
  const uni = params.universitySlug;
  const fac = params.facultySlug;

  const universityName = useFacultyStore(
    (s) => s.facultyData?.university?.name,
  );
  const facultyName = useFacultyStore((s) => s.facultyData?.name);

  return (
    <Sidebar>
      <SidebarHeader className="border-b h-14 flex justify-center items-center gap-0">
        {!universityName && !facultyName ? (
          <div className="space-y-1 flex flex-col justify-center items-center">
            <Skeleton className="h-3 w-12 rounded-full" />
            <Skeleton className="h-3 w-20 rounded-full" />
          </div>
        ) : (
          <>
            <div className="uppercase font-bold ">{universityName}</div>
            <div className="font-light text-sm text-muted-foreground ">
              {facultyName}
            </div>
          </>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between">
            <p>Projects</p>
            <CreateProjectModal />
          </SidebarGroupLabel>
          <SidebarMenu>
            {!projects || projects.length === 0 ? (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                No Projects Yet
              </div>
            ) : (
              projects?.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <Link href={`/app/${uni}/${fac}/projects/${project.slug}`}>
                    <SidebarMenuButton className="cursor-pointer">
                      <span>{project.name}</span>
                    </SidebarMenuButton>
                  </Link>
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

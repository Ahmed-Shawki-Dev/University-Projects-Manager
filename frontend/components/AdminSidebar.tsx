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
import { CurrentUserClaims } from "@/types/api";
import { GraduationCap, LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import NavUser from "./NavUser";

export function AdminSidebar({
  userClaims,
}: {
  userClaims?: CurrentUserClaims;
}) {
  const params = useParams();
  const pathname = usePathname();
  const uni = params.universitySlug;
  const fac = params.facultySlug;

  const adminNavItems = [
    {
      title: "Overview",
      url: `/app/${uni}/${fac}/admin-dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: "Doctors",
      url: `/app/${uni}/${fac}/admin-dashboard/doctors`,
      icon: Users,
    },
    {
      title: "Students",
      url: `/app/${uni}/${fac}/admin-dashboard/students`,
      icon: GraduationCap,
    },
    {
      title: "Settings",
      url: `/app/${uni}/${fac}/admin-dashboard/settings`,
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b h-14 flex justify-center items-center">
        <span className="font-bold uppercase">Admin Control</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarMenu>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url}>
                  <SidebarMenuButton isActive={pathname === item.url}>
                    <item.icon className="w-4 h-4 mr-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <NavUser user={userClaims} />
      </SidebarFooter>
    </Sidebar>
  );
}

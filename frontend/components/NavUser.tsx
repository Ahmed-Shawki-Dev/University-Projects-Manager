"use client";

import { logoutAction } from "@/action/auth/logout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getAvatarIcon } from "@/lib/utils";
import { CurrentUserClaims } from "@/types/api";
import { ChevronsUpDown, LogOut, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { useTransition } from "react";

interface NavUserProps {
  user?: CurrentUserClaims;
}

export default function NavUser({ user }: NavUserProps) {
  const params = useParams();
  const uni = params.universitySlug;
  const fac = params.facultySlug;
  const { setTheme, theme } = useTheme();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction({
        universitySlug: uni?.toString() ?? "",
        facultySlug: fac?.toString() ?? "",
      });
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.fullName} alt={user?.fullName} />
                <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-semibold">
                  {getAvatarIcon(user?.fullName ?? "")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.fullName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56  rounded-none"
            side="top"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-semibold">
                    {getAvatarIcon(user?.fullName ?? "")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.fullName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-xs">
                <Settings className="size-4 text-muted-foreground " />
                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer gap-2 rounded-xs"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="size-4 dark:hidden text-muted-foreground" />
                <Moon className="size-4 hidden dark:block text-muted-foreground" />
                <span>Toggle Theme</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="rounded-xs"
                  variant="destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <LogOut className="size-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be logged out of your session and will need to sign
                    in again to access your projects.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    disabled={isPending}
                    variant={"destructive"}
                  >
                    {isPending ? "Logging out..." : "Log out"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

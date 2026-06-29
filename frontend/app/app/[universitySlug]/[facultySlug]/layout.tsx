import AppHeader from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-1 flex-col min-h-screen ">
        <AppHeader />
        <div className="flex-1 p-6 pt-20">{children}</div>
      </main>
    </SidebarProvider>
  );
}

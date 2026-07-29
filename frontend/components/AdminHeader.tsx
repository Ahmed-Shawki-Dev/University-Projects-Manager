"use client";
import { useParams } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";

export default function AdminHeader() {
  const { universitySlug, facultySlug } = useParams();

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b bg-sidebar px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
      </div>
    </header>
  );
}

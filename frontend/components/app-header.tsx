"use client";
import { Compass } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

export default function AppHeader() {
  const { universitySlug, facultySlug } = useParams();

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
      </div>

      <div className="flex items-center gap-4">
        <Link href={`/app/${universitySlug}/${facultySlug}/projects/explore`}>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs font-medium"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Projects</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}

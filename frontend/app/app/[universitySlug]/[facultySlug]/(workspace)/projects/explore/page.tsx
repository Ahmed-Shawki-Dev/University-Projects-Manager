import { getAllProjectsExplorePage } from "@/action/project/getAllProjectsExplorePage";
import { Button } from "@/components/ui/button";
import { ProjectType } from "@/types/schema";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ExploreProjectCard from "./ExploreProjectCard";
import ProjectExploreFillter from "./ProjectExploreFillter";

interface IProps {
  params: Promise<{
    universitySlug: string;
    facultySlug: string;
  }>;
  searchParams: Promise<{
    projectType: ProjectType;
  }>;
}

export default async function ExploreProjectsPage({
  params,
  searchParams,
}: IProps) {
  const paramsRoutes = await params;
  const query = await searchParams;

  const projects = await getAllProjectsExplorePage(
    paramsRoutes,
    query.projectType,
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Explore Projects
          </h1>
          <p className="text-sm text-muted-foreground">
            Find and join an available team for this semester.
          </p>
        </div>
        <Link
          href={`/app/universities/${paramsRoutes.universitySlug}/faculties/${paramsRoutes.facultySlug}/projects`}
        >
          <Button
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to projects</span>
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-accent/20 p-3 rounded-lg border">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {projects.data.length}
          </span>{" "}
          projects
        </div>

        <div className="text-xs text-muted-foreground">
          <ProjectExploreFillter currentOption={query.projectType} />
        </div>
      </div>

      {projects?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl bg-muted/20 space-y-3">
          <div className="space-y-1">
            <p className="font-medium text-muted-foreground">
              No projects found
            </p>
            <p className="text-xs text-muted-foreground/70">
              There are no projects available under this category for now.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.data.map((p) => (
            <ExploreProjectCard key={p.id} project={p} params={paramsRoutes} />
          ))}
        </div>
      )}
    </div>
  );
}

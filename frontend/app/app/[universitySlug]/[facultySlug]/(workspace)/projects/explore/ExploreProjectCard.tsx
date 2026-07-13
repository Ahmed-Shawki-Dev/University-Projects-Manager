"use client";
import { JoinProjectTeam } from "@/action/project/joinProjectTeam";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectExploreDto, ProjectRouteParams } from "@/types/schema";

export default function ExploreProjectCard({
  project,
  params,
}: {
  project: ProjectExploreDto;
  params: ProjectRouteParams;
}) {
  return (
    <Card className="flex flex-col justify-between shadow-sm">
      <CardHeader>
        <CardTitle className="line-clamp-2">{project.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Team Capacity:</span>
          <span className="font-semibold text-foreground">
            {project.currentStudentCount} / {project.maxStudents} Students
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() =>
            JoinProjectTeam({
              universitySlug: params.universitySlug,
              facultySlug: params.facultySlug,
              projectSlug: project.slug,
            })
          }
          disabled={project.isCurrentStudentJoined || project.isFull}
          className="w-full"
          variant={project.isCurrentStudentJoined ? "outline" : "default"}
        >
          {project.isCurrentStudentJoined
            ? "Joined ✓"
            : project.isFull
              ? "Full Team"
              : "Join Project"}
        </Button>
      </CardFooter>
    </Card>
  );
}

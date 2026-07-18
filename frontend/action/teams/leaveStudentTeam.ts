"use server";
import { fetchApi } from "@/lib/fetchApi";
import { ProjectRouteParams, TeamMemberDto } from "@/types/schema";
import { revalidatePath } from "next/cache";

export async function leaveStudentTeam(slugs: ProjectRouteParams) {
  const res = await fetchApi<TeamMemberDto[]>(
    `/api/universities/${slugs.universitySlug}/faculties/${slugs.facultySlug}/projects/${slugs.projectSlug}/team/leave`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (res.isSuccess) {
    revalidatePath(
      "/app/[universitySlug]/[facultySlug]/projects/[projectSlug]",
      "layout",
    );
  }
}

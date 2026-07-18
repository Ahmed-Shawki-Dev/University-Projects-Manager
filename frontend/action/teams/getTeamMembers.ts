import { fetchApi } from "@/lib/fetchApi";
import { ProjectRouteParams, TeamMemberDto } from "@/types/schema";

export async function getTeamMembers(slugs: ProjectRouteParams) {
  const res = fetchApi<TeamMemberDto[]>(
    `/api/universities/${slugs.universitySlug}/faculties/${slugs.facultySlug}/projects/${slugs.projectSlug}/team`,
  );
  return res;
}

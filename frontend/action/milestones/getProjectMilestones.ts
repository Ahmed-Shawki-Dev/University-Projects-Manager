import { fetchApi } from "@/lib/fetchApi";
import { MilestoneDto, ProjectRouteParams } from "@/types/schema";

export async function getProjectMilestones(slugs: ProjectRouteParams) {
  const res = await fetchApi<MilestoneDto[]>(
    `/api/universities/${slugs.universitySlug}/faculties/${slugs.facultySlug}/projects/${slugs.projectSlug}/milestones`,
  );
  return res;
}

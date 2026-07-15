import { fetchApi } from "@/lib/fetchApi";
import { MilestoneWithTasksDto, ProjectRouteParams } from "@/types/schema";

export async function getMilestonesWithTasks(slugs: ProjectRouteParams) {
  const res = await fetchApi<MilestoneWithTasksDto[]>(
    `/api/universities/${slugs.universitySlug}/faculties/${slugs.facultySlug}/projects/${slugs.projectSlug}/milestones-with-tasks`,
  );

  return res;
}

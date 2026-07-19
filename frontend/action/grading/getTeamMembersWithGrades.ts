import { fetchApi } from "@/lib/fetchApi";
import { ProjectRouteParams, StudentMilestoneGradeDto } from "@/types/schema";

export const getTeamMembersWithGrades = async (
  slugs: ProjectRouteParams,
  milestoneId: string,
) => {
  const res = await fetchApi<StudentMilestoneGradeDto[]>(
    `/api/universities/${slugs.universitySlug}/faculties/${slugs.facultySlug}/projects/${slugs.projectSlug}/milestones/${milestoneId}/grades`,
  );

  if (!res.isSuccess) {
    throw res;
  }

  return res.data;
};

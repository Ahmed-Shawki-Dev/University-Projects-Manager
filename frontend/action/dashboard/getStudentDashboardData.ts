import { fetchApi } from "@/lib/fetchApi";
import {
  ProjectRouteParams,
  StudentDashboardResponseDto,
} from "@/types/schema";

export const getStudentDashboardData = async (slugs: ProjectRouteParams) => {
  const res = await fetchApi<StudentDashboardResponseDto>(
    `/api/universities/${slugs.universitySlug}/faculties/${slugs.facultySlug}/dashboard/student`,
  );
  return res;
};

import { fetchApi } from "@/lib/fetchApi";
import { DoctorDashboardResponseDto, ProjectRouteParams } from "@/types/schema";

export const getDoctorDashboardData = async (slugs: ProjectRouteParams) => {
  const res = await fetchApi<DoctorDashboardResponseDto>(
    `/api/universities/${slugs.universitySlug}/faculties/${slugs.facultySlug}/dashboard/doctor`,
  );
  return res;
};

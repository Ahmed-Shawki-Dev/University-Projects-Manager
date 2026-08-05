import { fetchApi } from "@/lib/fetchApi";
import { DoctorDto, ProjectRouteParams } from "@/types/schema";

export const getDoctor = async (
  slugs: ProjectRouteParams,
  doctorId: string,
) => {
  const { facultySlug, universitySlug } = slugs;

  const res = await fetchApi<DoctorDto>(
    `/api/universities/${universitySlug}/faculties/${facultySlug}/doctors/${doctorId}`,
  );

  return res;
};

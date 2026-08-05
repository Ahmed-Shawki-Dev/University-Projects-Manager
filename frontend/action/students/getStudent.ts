import { fetchApi } from "@/lib/fetchApi";
import { ProjectRouteParams, StudentDto } from "@/types/schema";

export const getStudent = async (
  slugs: ProjectRouteParams,
  studentId: string,
) => {
  const { facultySlug, universitySlug } = slugs;

  const res = fetchApi<StudentDto>(
    `api/universities/${universitySlug}/faculties/${facultySlug}/students/${studentId}`,
  );

  return res;
};

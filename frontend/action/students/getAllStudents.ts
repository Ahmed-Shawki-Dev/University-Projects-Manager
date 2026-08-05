import { fetchApi } from "@/lib/fetchApi";
import { ProjectRouteParams, StudentDto } from "@/types/schema";

export const getAllStudents = async (slugs: ProjectRouteParams) => {
  const { facultySlug, universitySlug } = slugs;

  const res = fetchApi<StudentDto[]>(
    `api/universities/${universitySlug}/faculties/${facultySlug}/students`,
  );

  return res;
};

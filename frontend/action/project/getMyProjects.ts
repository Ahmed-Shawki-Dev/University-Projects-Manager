"use server";

import { fetchApi } from "@/lib/fetchApi";
import { ProjectDto, ProjectRouteParams } from "@/types/schema";


export const getMyProjects = async(slugs:ProjectRouteParams) => {

  const res = await fetchApi<ProjectDto[]>(
    `/api/universities/${slugs.universitySlug}/faculties/${slugs.facultySlug}/projects/my-projects`,
  );

return res;
}

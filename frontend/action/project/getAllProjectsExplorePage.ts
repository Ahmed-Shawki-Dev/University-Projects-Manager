"use server";

import { fetchApi } from "@/lib/fetchApi";
import {
  ProjectExploreDto,
  ProjectRouteParams,
  ProjectType,
} from "@/types/schema";

export const getAllProjectsExplorePage = async (
  params: ProjectRouteParams,
  type?: ProjectType,
) => {
  let url = `/api/universities/${params.universitySlug}/faculties/${params.facultySlug}/projects`;
  if (type) {
    url += `?projectType=${type}`;
  }

  const res = await fetchApi<ProjectExploreDto[]>(url);

  return res;
};

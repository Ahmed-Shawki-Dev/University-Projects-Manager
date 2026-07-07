"use server";

import { fetchApi } from "@/lib/fetchApi";
import { FacultyLayoutDto, ProjectRouteParams } from "@/types/schema";

export const getFacultyLayoutDetails = async (params: ProjectRouteParams) => {
  const { facultySlug, universitySlug } = params;

  const res = await fetchApi<FacultyLayoutDto>(
    `api/universities/${universitySlug}/faculties/${facultySlug}/layout-details`,
    {
      cache: "no-store",
    },
  );

  return res;
};

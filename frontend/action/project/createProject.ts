"use server";

import { fetchApi } from "@/lib/fetchApi";
import { CreateProjectDto, ProjectRouteParams } from "@/types/schema";
import { revalidatePath } from "next/cache";

export async function createProject(
  projectData: CreateProjectDto,
  routeParams: ProjectRouteParams,
) {
  const { facultySlug, universitySlug } = routeParams;

  const res = await fetchApi(
    `/api/universities/${universitySlug}/faculties/${facultySlug}/projects`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(projectData),
    },
  );
  if (res.isSuccess) {
    revalidatePath("/app/[universitySlug]/[facultySlug]/projects", "layout");
  }

  return res;
}

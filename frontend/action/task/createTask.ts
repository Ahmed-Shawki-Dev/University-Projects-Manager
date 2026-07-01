"use server";

import { fetchApi } from "@/lib/fetchApi";
import { CreateTaskDto, ProjectRouteParams } from "@/types/schema";
import { revalidatePath } from "next/cache";

export async function createTask(
  taskData: CreateTaskDto,
  routeParams: ProjectRouteParams,
) {
  const { facultySlug, projectSlug, universitySlug } = routeParams;

  const res = await fetchApi(
    `/api/universities/${universitySlug}/faculties/${facultySlug}/projects/${projectSlug}/tasks`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(taskData),
    },
  );
  if (res.isSuccess) {
    revalidatePath(
      "/app/[universitySlug]/[facultySlug]/projects/[projectSlug]",
      "layout",
    );
  }

  return res;
}

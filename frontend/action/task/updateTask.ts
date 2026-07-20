"use server";

import { fetchApi } from "@/lib/fetchApi";
import { ProjectRouteParams, UpdateTaskDto } from "@/types/schema";
import { revalidatePath } from "next/cache";

export const updateTask = async (
  taskId: string,
  data: UpdateTaskDto,
  slugs: ProjectRouteParams,
) => {
  const res = await fetchApi(`/api/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  if (res.isSuccess) {
    revalidatePath(
      `/app/${slugs.universitySlug}/${slugs.facultySlug}/projects/${slugs.projectSlug}`,
    );
  }

  return res;
};

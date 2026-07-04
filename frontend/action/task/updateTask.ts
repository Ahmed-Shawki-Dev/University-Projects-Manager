"use server";

import { fetchApi } from "@/lib/fetchApi";
import { UpdateTaskDto } from "@/types/schema";
import { revalidatePath } from "next/cache";

export const updateTask = async (taskId: string, data: UpdateTaskDto) => {
  const res = await fetchApi(`/api/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  if (res.isSuccess) {
    revalidatePath(
      "/app/[universitySlug]/[facultySlug]/projects/[projectSlug]",
      "layout",
    );
  }

  return res;
};

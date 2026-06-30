"use server";

import { fetchApi } from "@/lib/fetchApi";
import { UpdateTaskStatusDto } from "@/types/schema";
import { revalidatePath } from "next/cache";

export async function updateTaskStatus(
  taskId: string,
  newStatus: UpdateTaskStatusDto,
) {
  const res = await fetchApi(`/api/tasks/${taskId}/status`, {
    method: "PUT",
    body: JSON.stringify(newStatus),
    headers: { "Content-Type": "application/json" },
  });

  if (res.isSuccess) {
    revalidatePath(
      "/app/[universitySlug]/[facultySlug]/projects/[projectSlug]",
      "layout",
    );
  }

  return res;
}

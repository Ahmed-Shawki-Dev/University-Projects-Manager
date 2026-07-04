"use server";

import { fetchApi } from "@/lib/fetchApi";
import { revalidatePath } from "next/cache";

export async function removeTask(taskId: string) {
  const res = await fetchApi(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });

  if (res.isSuccess) {
    revalidatePath(
      "/app/[universitySlug]/[facultySlug]/projects/[projectSlug]",
      "layout",
    );
  }
}

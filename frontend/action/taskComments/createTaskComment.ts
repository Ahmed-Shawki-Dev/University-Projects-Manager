"use server";

import { fetchApi } from "@/lib/fetchApi";
import { CreateTaskCommentDto, TaskCommentDto } from "@/types/schema";
import { revalidatePath } from "next/cache";

export default async function createTaskComment(
  taskId: string,
  taskCommentContent: CreateTaskCommentDto,
) {
  const res = await fetchApi<TaskCommentDto>(`/api/tasks/${taskId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskCommentContent),
  });

  if (res.isSuccess) {
    revalidatePath(
      "/app/[universitySlug]/[facultySlug]/projects/[projectSlug]",
      "layout",
    );
  }
  return res;
}

"use server";

import { fetchApi } from "@/lib/fetchApi";
import { TaskAttachmentDto } from "@/types/schema";

export async function getTaskAttachments(taskId: string) {
  return await fetchApi<TaskAttachmentDto[]>(
    `/api/tasks/${taskId}/attachments`,
    {
      method: "GET",
    },
  );
}

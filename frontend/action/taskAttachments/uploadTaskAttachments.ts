"use server";

import { fetchApi } from "@/lib/fetchApi";
import { TaskAttachmentDto } from "@/types/schema";
import { revalidatePath } from "next/cache";

export async function uploadTaskAttachments(
  taskId: string,
  data: { files: File[] },
) {
  const formData = new FormData();

  data.files.forEach((file) => {
    formData.append("Files", file);
  });

  const res = await fetchApi<TaskAttachmentDto[]>(
    `/api/tasks/${taskId}/attachments`,
    {
      method: "POST",
      body: formData,
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

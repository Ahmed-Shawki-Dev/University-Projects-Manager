import { fetchApi } from "@/lib/fetchApi";
import { TaskCommentDto } from "@/types/schema";

export default async function getTaskCommentById(
  taskId: string,
  commentId: string,
) {
  const res = await fetchApi<TaskCommentDto>(
    `/api/tasks/${taskId}/comments/${commentId}`,
  );

  return res;
}

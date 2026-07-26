import { fetchApi } from "@/lib/fetchApi";
import { TaskCommentDto } from "@/types/schema";

export default async function getAllTaskComments(taskId: string) {
  const res = await fetchApi<TaskCommentDto[]>(`/api/tasks/${taskId}/comments`);

  return res;
}

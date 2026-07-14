import { fetchApi } from "@/lib/fetchApi";
import { KanbanBoardDto, ProjectRouteParams } from "@/types/schema";

export async function getTaskBoards(slugs: ProjectRouteParams) {
  const res = fetchApi<KanbanBoardDto>(
    `/api/universities/${slugs.universitySlug}/faculties/${slugs.facultySlug}/projects/${slugs.projectSlug}/tasks`,
  );
  return res;
}

import { fetchApi } from "@/lib/fetchApi";
import {
  KanbanBoardDto,
  KanbanTasksFilters,
  ProjectRouteParams,
} from "@/types/schema";

export async function getTaskBoards(
  slugs: ProjectRouteParams,
  queries?: KanbanTasksFilters,
) {
  let url = `/api/universities/${slugs.universitySlug}/faculties/${slugs.facultySlug}/projects/${slugs.projectSlug}/tasks`;

  const searchParams = new URLSearchParams();

  if (queries?.milestoneId) {
    searchParams.append("milestoneId", queries.milestoneId);
  }
  if (queries?.studentId) {
    searchParams.append("studentId", queries.studentId);
  }
  if (queries?.onlyMyTasks) {
    searchParams.append("onlyMyTasks", "true");
  }

  const queryString = searchParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const res = fetchApi<KanbanBoardDto>(url);
  return res;
}

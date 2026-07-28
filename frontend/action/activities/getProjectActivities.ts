import { fetchApi } from "@/lib/fetchApi";
import { ProjectActivitiesDto } from "@/types/schema";

export const getProjectActivities = async (projectSlug: string) => {
  const res = await fetchApi<ProjectActivitiesDto[]>(
    `/api/activities/${projectSlug}`,
  );

  return res;
};

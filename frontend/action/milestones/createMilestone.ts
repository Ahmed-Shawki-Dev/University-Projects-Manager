"use server";

import { fetchApi } from "@/lib/fetchApi";
import {
  CreateMilestoneDto,
  MilestoneDto,
  ProjectRouteParams,
} from "@/types/schema";
import { revalidatePath } from "next/cache";

export async function createMilestone(
  milestone: CreateMilestoneDto,
  slugs: ProjectRouteParams,
) {
  const res = await fetchApi<MilestoneDto>(
    `/api/universities/${slugs.universitySlug}/faculties/${slugs.facultySlug}/projects/${slugs.projectSlug}/milestones`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(milestone),
    },
  );
  if (res.isSuccess) {
    revalidatePath(
      "/app/[universitySlug]/[facultySlug]/doctor-dashboard",
      "layout",
    );
  }

  return res;
}

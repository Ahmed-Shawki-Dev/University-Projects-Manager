"use server";

import { fetchApi } from "@/lib/fetchApi";
import { ProjectRouteParams, SubmitStudentGradeDto } from "@/types/schema";
import { revalidatePath } from "next/cache";

export async function createBulkGrade(
  slugs: ProjectRouteParams,
  milestoneId: string,
  grades: SubmitStudentGradeDto[],
) {
  const res = await fetchApi(
    `/api/universities/${slugs.universitySlug}/faculties/${slugs.facultySlug}/projects/${slugs.projectSlug}/milestones/${milestoneId}/bulk-grade`,
    {
      method: "POST",
      body: JSON.stringify(grades),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (res.isSuccess) {
    revalidatePath(
      "/app/[universitySlug]/[facultySlug]/projects/[projectSlug]",
      "layout",
    );
  }

  return res.message;
}

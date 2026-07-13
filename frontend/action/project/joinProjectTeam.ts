"use server";

import { fetchApi } from "@/lib/fetchApi";
import { ProjectRouteParams } from "@/types/schema";
import { revalidatePath } from "next/cache";

export async function JoinProjectTeam({
  universitySlug,
  facultySlug,
  projectSlug,
}: ProjectRouteParams) {
  const res = await fetchApi(
    `/api/universities/${universitySlug}/faculties/${facultySlug}/projects/${projectSlug}/join`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (res.isSuccess) {
    revalidatePath(
      "/app/[universitySlug]/[facultySlug]/projects/explore",
      "layout",
    );
  }
}

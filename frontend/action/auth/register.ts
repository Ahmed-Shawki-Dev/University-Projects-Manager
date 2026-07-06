"use server";

import { fetchApi } from "@/lib/fetchApi";
import { ProjectRouteParams, RegisterDto } from "@/types/schema";
import { RegisterInput } from "@/validation/register";
import { revalidatePath } from "next/cache";

export const registerAction = async (
  data: RegisterInput,
  slugs: ProjectRouteParams,
) => {
  const { facultySlug, universitySlug } = slugs;

  const res = await fetchApi<RegisterDto>(
    `/api/auth/register/${universitySlug}/${facultySlug}/student`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (res.isSuccess) {
    revalidatePath("/app/[universitySlug]/[facultySlug]", "layout");
  }

  return res;
};

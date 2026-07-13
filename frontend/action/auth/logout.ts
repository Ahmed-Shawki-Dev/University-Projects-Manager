"use server";

import { ProjectRouteParams } from "@/types/schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction(slugs: ProjectRouteParams) {
  const cookieStore = await cookies();

  cookieStore.delete("token");

  redirect(`/app/${slugs.universitySlug}/${slugs.facultySlug}/login`);
}

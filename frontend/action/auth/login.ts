"use server";

import { fetchApi } from "@/lib/fetchApi";
import { LoginResponseDto, ProjectRouteParams } from "@/types/schema";
import { LoginInput } from "@/validation/login";

import { cookies } from "next/headers";

export const loginAction = async (
  data: LoginInput,
  slugs: ProjectRouteParams,
) => {
  const { facultySlug, universitySlug } = slugs;

  const res = await fetchApi<LoginResponseDto>(
    `/api/auth/login/${universitySlug}/${facultySlug}`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.isSuccess) {
    return res;
  }

  const cookieStore = await cookies();

  const isHttps =
    process.env.NEXT_PUBLIC_SERVER_URL?.startsWith("https://") ?? false;

  cookieStore.set("token", res.data.token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return res;
};

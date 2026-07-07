"use server";

import { fetchApi } from "@/lib/fetchApi";
import { ProjectRouteParams, UserLoginResponseDto } from "@/types/schema";
import { LoginInput } from "@/validation/login";

import { cookies } from "next/headers";

export const loginAction = async (
  data: LoginInput,
  slugs: ProjectRouteParams,
) => {
  const { facultySlug, universitySlug } = slugs;

  const res = await fetchApi<UserLoginResponseDto>(
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
  cookieStore.set("token", res.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return res;
};

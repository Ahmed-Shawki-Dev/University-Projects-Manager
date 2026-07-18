"use server";

import { CurrentUserClaims } from "@/types/api";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  if (!token) return null;

  try {
    const userData = decodeJwt(token) as unknown as CurrentUserClaims;
    return userData;
  } catch {
    return null;
  }
}

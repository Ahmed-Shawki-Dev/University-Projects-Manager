"use server";
import { ApiResponse } from "@/types/api";
import { cookies } from "next/headers";

const baseUrl = process.env.SERVER_URL;

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const newHeaders = new Headers(options?.headers);

    if (token) {
      newHeaders.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(`${baseUrl}${cleanEndpoint}`, {
      ...options,
      headers: newHeaders,
    });

    let responseData: Partial<ApiResponse<T>> | null = null;
    try {
      responseData = await res.json();
    } catch {
      responseData = null;
    }

    if (!res.ok) {
      return {
        isSuccess: false,
        message: responseData?.message || `There Is Error ${res.status}`,
        data: null as unknown as T,
        errors: responseData?.errors || ["Server Error Occurred"],
        status: res.status,
      };
    }
    if (!responseData) {
      return {
        isSuccess: true,
        message: "Done Successfully",
        data: null as unknown as T,
        errors: [],
        status: res.status,
      };
    }

    return responseData as ApiResponse<T>;
  } catch {
    return {
      isSuccess: false,
      message: `There Is Error`,
      data: null as unknown as T,
      errors: ["Server Error Occurred"],
      status: 500,
    };
  }
}

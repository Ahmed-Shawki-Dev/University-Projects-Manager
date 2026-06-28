"use server";
import { ApiResponse } from "@/types/api";

const baseUrl = process.env.SERVER_URL;

export async function fetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const res = await fetch(`${baseUrl}${cleanEndpoint}`);

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
      };
    }
    if (!responseData) {
      return {
        isSuccess: true,
        message: "Done Successfully",
        data: null as unknown as T,
        errors: [],
      };
    }

    return responseData as ApiResponse<T>;
  } catch {
    return {
      isSuccess: false,
      message: `There Is Error`,
      data: null as unknown as T,
      errors: ["Server Error Occurred"],
    };
  }
}

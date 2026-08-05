"use server";
import { fetchApi } from "@/lib/fetchApi";
import { CreateDoctorDto, DoctorDto, ProjectRouteParams } from "@/types/schema";
import { revalidatePath } from "next/cache";

export const createNewDoctor = async (
  slugs: ProjectRouteParams,
  doctor: CreateDoctorDto,
) => {
  const { facultySlug, universitySlug } = slugs;

  const res = await fetchApi<DoctorDto>(
    `/api/universities/${universitySlug}/faculties/${facultySlug}/doctors`,
    {
      method: "POST",
      body: JSON.stringify(doctor),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (res.isSuccess) {
    revalidatePath(
      "/app/[universitySlug]/[facultySlug]/admin-dashboard",
      "layout",
    );
  }

  return res;
};

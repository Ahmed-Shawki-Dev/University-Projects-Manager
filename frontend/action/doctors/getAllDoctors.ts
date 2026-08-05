"use server";
import { fetchApi } from "@/lib/fetchApi";
import { DoctorDto, ProjectRouteParams } from "@/types/schema";

export const getAllDoctors = async (slugs: ProjectRouteParams) => {
  const { facultySlug, universitySlug } = slugs;

  const res = await fetchApi<DoctorDto[]>(
    `/api/universities/${universitySlug}/faculties/${facultySlug}/doctors`,
  );
  return res;
};
